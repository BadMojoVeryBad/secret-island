import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { TilemapStrategyInterface } from '../../strategies/tilemapStrategyInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class DirectionArrows extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private arrows: Phaser.GameObjects.Sprite[] = [];
    private player: PlayerData;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('directionArrows', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'directionArrows');
            sprite.setAlpha(0);
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            sprite.setData('active', false);
            this.scene.physics.add.existing(sprite, true);
            (sprite.body as Phaser.Physics.Arcade.Body).setCircle(16);
            (sprite.body as Phaser.Physics.Arcade.Body).setOffset(-16 + (sprite.width * this.constants.SCALE * this.constants.HALF), -16 + (sprite.height * this.constants.SCALE * this.constants.HALF));
            this.arrows.push(sprite);
        });

        this.events.on('downArrow', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'downIndicator');
            sprite.setAlpha(0);
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            sprite.setData('active', false);
            this.scene.physics.add.existing(sprite, true);
            (sprite.body as Phaser.Physics.Arcade.Body).setCircle(16);
            (sprite.body as Phaser.Physics.Arcade.Body).setOffset(-16 + (sprite.width * this.constants.SCALE * this.constants.HALF), -16 + (sprite.height * this.constants.SCALE * this.constants.HALF));
            this.arrows.push(sprite);
        });

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;
        });
    }

    public afterCreate(): void {

    }

    public update(): void {
        for (let i = 0; i < this.arrows.length; i++) {
            const arrow = this.arrows[i];
            const collide = this.scene.physics.overlap(arrow, this.player.sprite);

            if (!arrow.getData('active') && collide) {
                // Fade in.
                arrow.setData('active', true);
                this.scene.tweens.add({
                    targets: arrow,
                    alpha: { from: 0, to: 1 },
                    ease: 'Linear',
                    duration: 200,
                    repeat: 0,
                    yoyo: false
                });
            }
            else if (arrow.getData('active') && !collide) {
                // Fade out.
                arrow.setData('active', false);
                this.scene.tweens.add({
                    targets: arrow,
                    alpha: { from: 1, to: 0 },
                    ease: 'Linear',
                    duration: 200,
                    repeat: 0,
                    yoyo: false
                });
            }
        }
    }
}
