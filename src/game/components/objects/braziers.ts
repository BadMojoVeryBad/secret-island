import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { TilemapStrategyInterface } from '../../strategies/tilemapStrategyInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class Braziers extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private braziers: Phaser.GameObjects.Sprite[] = [];
    private player: PlayerData;
    private tilemapStrategy: TilemapStrategyInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants, @inject('TilemapStrategyInterface') tilemapStrategy: TilemapStrategyInterface) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.tilemapStrategy = tilemapStrategy;
    }

    public create(): void {
        this.events.on('brazier', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'brazier');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.PLAYER_DEPTH - 1);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            sprite.setData('active', false);
            sprite.setData('event', this.tilemapStrategy.getProperty<string>(event, 'event'));
            this.scene.physics.add.existing(sprite, true);
            (sprite.body as Phaser.Physics.Arcade.Body).setCircle(16);
            (sprite.body as Phaser.Physics.Arcade.Body).setOffset(-16 + (sprite.width * this.constants.SCALE * this.constants.HALF), -16 + (sprite.height * this.constants.SCALE * this.constants.HALF));
            this.braziers.push(sprite);

            const sprite2 = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'fireIndicator');
            sprite2.setScale(this.constants.SCALE);
            sprite2.setDepth(this.constants.PLAYER_DEPTH - 1);
            sprite.setData('fireIndicator', sprite2);
            sprite2.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height) * this.constants.SCALE);
            sprite2.setAlpha(0);

            const particles = this.scene.add.particles('textures', 'yellowParticle');
            const emitter = particles.createEmitter({
                alpha: { start: 1, end: 0 },
                gravityY: 0,
                speed: { max: 1, min: 4 },
                quantity: 4,
                frequency: 1000,
                lifespan: 3000,
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Circle(0, 0, 4),
                    quantity: 100,
                    stepRate: 0,
                    yoyo: false,
                    seamless: true,
                },
            });
            emitter.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            emitter.setScale(this.constants.SCALE);
            particles.setDepth(this.constants.PLAYER_DEPTH - 2);
        });

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;
        });
    }

    public afterCreate(): void {

    }

    public update(): void {
        for (let i = 0; i < this.braziers.length; i++) {
            const brazier = this.braziers[i];
            const fireIndicator: Phaser.GameObjects.Sprite = brazier.getData('fireIndicator');
            const collide = this.scene.physics.overlap(brazier, this.player.sprite);

            if (this.player.isActive && !brazier.getData('active') && collide) {
                brazier.setData('active', true);
                brazier.anims.play('brazierAlight', true);
                fireIndicator.setAlpha(0);
                fireIndicator.setData('active', false);
                this.events.fire(brazier.getData('event'), brazier);

                const particles = this.scene.add.particles('textures', 'whiteParticle');
                const emitter = particles.createEmitter({
                    alpha: { start: 1, end: 0 },
                    gravityY: -20,
                    speed: { max: 1, min: 4 },
                    quantity: 3,
                    frequency: 20,
                    lifespan: 3000,
                    emitZone: {
                        type: 'random',
                        source: new Phaser.Geom.Circle(0, 0, 4),
                        quantity: 100,
                        stepRate: 0,
                        yoyo: false,
                        seamless: true,
                    },
                });
                emitter.setPosition(brazier.x * this.constants.SCALE, brazier.y * this.constants.SCALE);
                emitter.setScale(this.constants.SCALE);
                particles.setDepth(this.constants.PLAYER_DEPTH - 2);
            }

            if (collide && !brazier.getData('active') && !fireIndicator.getData('active')) {
                this.scene.tweens.add({
                    targets: fireIndicator,
                    alpha: { from: 0, to: 1 },
                    ease: 'Linear',
                    duration: 200,
                    repeat: 0,
                    yoyo: false
                });
                fireIndicator.setData('active', true);
            } else if (!collide && !brazier.getData('active') && fireIndicator.getData('active')) {
                this.scene.tweens.add({
                    targets: fireIndicator,
                    alpha: { from: 1, to: 0 },
                    ease: 'Linear',
                    duration: 200,
                    repeat: 0,
                    yoyo: false
                });
                fireIndicator.setData('active', false);
            }
        }
    }
}
