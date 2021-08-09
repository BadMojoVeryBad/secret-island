import { Component } from '../../framework/component';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../framework/utilities/loggerInterface';
import { EventsInterface } from '../../framework/utilities/eventsInterface';
import { Constants } from '../utilities/constants';
import { PlayerStrategyInterface } from '../strategies/playerStrategyInterface';

export class PlayerData {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public isGrounded = false;
    public lastGrounded = 0;
    public isJumping = false;
    public isActive = false;
    public canMove = true;
    public isSitting = true;
}

@injectable()
export class Player extends Component {
    private player: PlayerData;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private playerStrategy: PlayerStrategyInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants, @inject('PlayerStrategyInterface') playerStrategy: PlayerStrategyInterface) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.playerStrategy = playerStrategy;
    }

    public init(): void {
        // Components can be added from components (nested components).
        // this.addComponent('anotherComponent');
    }

    public create(): void {
        this.logger.info('Running "create()" for "robot".');

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.player = new PlayerData();
        this.player.sprite = this.scene.physics.add.sprite(137, 189, 'textures', 'player');
        this.player.sprite.setDepth(this.constants.PLAYER_DEPTH);
        this.player.sprite.setSize(3, 10);
        this.player.sprite.body.setOffset(8, 6);
        // this.player.sprite.setCollideWorldBounds(true);

        this.events.on('playerStart', (event: Phaser.Types.Tilemaps.TiledObject) => {
            this.player.sprite.setPosition((event.x + this.player.sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - this.player.sprite.height * this.constants.HALF) * this.constants.SCALE);
        });

        this.events.on('disableControls', () => {
            this.player.canMove = false;
        });

        this.events.on('enableControls', () => {
            this.player.canMove = true;
        });

        this.events.on('robotMovingLeft', () => {
            this.player.isSitting = false;
        });

        this.events.on('robotMovingRight', () => {
            this.player.isSitting = false;
        });

        this.events.on('robotJumping', () => {
            this.player.isSitting = false;
        });
    }

    public afterCreate(): void {
        this.logger.info('Running "afterCreate()" for "robot".');

        this.logger.info('Firing "robotCreated" event.');
        this.events.fire('playerCreated', this.player);

        this.logger.info('Finished "afterCreate()" for "robot".');
    }

    public update(time: number, delta: number): void {
        // Set x velocity.
        const velocityX = this.playerStrategy.getVelocityX(this.player.canMove);
        if (velocityX !== null) {
            this.player.sprite.setVelocityX(velocityX);
        }

        // Set y velocity.
        const velocityY = this.playerStrategy.getVelocityY(this.player.sprite.body.velocity, this.player.isGrounded, this.player.lastGrounded, this.player.isJumping, this.player.canMove);
        if (velocityY !== null) {
            this.player.sprite.setVelocityY(velocityY);
        }

        // Set grounded flag.
        this.player.isGrounded = (this.player.sprite.body.blocked.down || this.player.sprite.body.touching.down);

        // Set last grounded time.
        if (this.player.isGrounded) {
            this.player.lastGrounded = time;
            this.player.isJumping = false;
        }

        // Set the flipX flag.
        this.player.sprite.flipX = this.playerStrategy.getFlipX(this.player.sprite.flipX, this.player.sprite.body.velocity.x);

        // Set the isActive flag.
        this.player.isActive = this.playerStrategy.isActive();

        const animation = this.playerStrategy.getAnimation(this.player.sprite.body.velocity, (this.player.sprite.body.blocked.down || this.player.sprite.body.touching.down), this.player.isSitting);
        this.player.sprite.anims.play(animation, true);
    }
}
