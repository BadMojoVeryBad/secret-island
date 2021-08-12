import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class Barrier2 extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private barrier: Phaser.GameObjects.Sprite;
    private player: PlayerData;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('barrier2', (event: Phaser.Types.Tilemaps.TiledObject) => {
            this.barrier = this.scene.add.sprite((event.x + event.width * this.constants.HALF) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE, 'textures', 'barrier2');
            this.scene.physics.add.existing(this.barrier, true);
            (this.barrier.body as Phaser.Physics.Arcade.Body).setSize(this.barrier.width, this.barrier.height);
            this.barrier.setScale(this.constants.SCALE);
            this.barrier.setDepth(this.constants.OBJECT_DEPTH + 2);
            this.barrier.flipX = event.flippedHorizontal;
            this.barrier.flipY = event.flippedVertical;

            if (this.player) {
                this.scene.physics.add.collider(this.player.sprite, this.barrier);
            }
        });

        this.events.on('lightBrazier2', (brazier: Phaser.GameObjects.Sprite) => {
            this.events.fire('disableControls');
            this.events.fire('increaseSaturation');
            this.events.fire('playAudio', { key: 'brazier2', volume: 0.6 });
            this.events.fire('playSpatialAudio', {
                key: 'flame',
                x: brazier.x,
                y: brazier.y,
                radius: 32,
                loop: true,
                volume: 0.3,
            });

            setTimeout(() => {
                this.events.fire('playAudio', { key: 'music2', volume: 0.7 });
            }, 500);

            setTimeout(() => {
                this.scene.cameras.main.stopFollow();
                this.scene.cameras.main.pan(948, 196, 4000, 'Quad.easeInOut', false, (camera: any, progress: number) => {
                    if (progress !== 1) {
                        return;
                    }

                    setTimeout(() => {
                        this.events.fire('playAudio', { key: 'dissolve' });

                        // Particle emitter thing.
                        const particles = this.scene.add.particles('textures', 'greenParticle');
                        const emitter = particles.createEmitter({
                            alpha: { start: 1, end: 0 },
                            gravityY: -5,
                            speed: { max: 10, min: 15 },
                            quantity: 3,
                            frequency: -1,
                            lifespan: 2000,
                            emitZone: {
                                type: 'random',
                                source: new Phaser.Geom.Rectangle(this.barrier.x - this.barrier.width / 2, this.barrier.y - this.barrier.height / 2, this.barrier.width, this.barrier.height),
                                quantity: 100,
                                stepRate: 0,
                                yoyo: false,
                                seamless: true,
                            },
                        });
                        emitter.setPosition(this.barrier.x * this.constants.SCALE, this.barrier.y * this.constants.SCALE);
                        emitter.setScale(this.constants.SCALE);
                        particles.setDepth(this.constants.PLAYER_DEPTH - 2);
                        emitter.explode(1000, 0, 0);

                        // Remove barrier.
                        this.barrier.destroy();

                        setTimeout(() => {
                            this.scene.cameras.main.pan(this.player.sprite.x, this.player.sprite.y, 3000, 'Quad.easeInOut', false, (camera: any, progress: number) => {
                                if (progress !== 1) {
                                    return;
                                }

                                this.scene.cameras.main.startFollow(this.player.sprite);
                                this.scene.cameras.main.setLerp(this.constants.CAMERA_LERP);
                                this.events.fire('enableControls');
                            });
                        }, 2500);
                    }, 1000);
                });
            }, 2000);
        });

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;

            if (this.barrier) {
                this.scene.physics.add.collider(this.player.sprite, this.barrier);
            }
        });
    }

    public update() {

    }
}
