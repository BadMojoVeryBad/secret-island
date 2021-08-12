import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class Eye extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private eyes: Phaser.GameObjects.Sprite[] = [];

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('eye', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'eyeBg');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.PLAYER_DEPTH - 2);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);

            const sprite2 = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'eyeClosed');
            sprite2.setScale(this.constants.SCALE);
            sprite2.setDepth(this.constants.PLAYER_DEPTH - 1);
            sprite2.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            sprite.setData('eye', sprite2);
            this.eyes.push(sprite);

            const particles = this.scene.add.particles('textures', 'whiteParticle');
            const emitter = particles.createEmitter({
                alpha: { start: 1, end: 0 },
                gravityY: 0,
                speed: { max: 1, min: 4 },
                quantity: 4,
                frequency: 1000,
                lifespan: 3000,
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0 - sprite.width / 2, 0 - sprite.height / 2, sprite.width, sprite.height),
                    quantity: 100,
                    stepRate: 0,
                    yoyo: false,
                    seamless: true,
                },
            });
            emitter.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            emitter.setScale(this.constants.SCALE);
            particles.setDepth(this.constants.PLAYER_DEPTH + 2);
        });

        this.events.on('lightBrazier4', (brazier: Phaser.GameObjects.Sprite) => {
            this.events.fire('disableControls');
            this.events.fire('addMask', new Phaser.Math.Vector2(brazier.x, brazier.y));
            this.events.fire('playAudio', { key: 'brazier4', volume: 0.6 });
            this.events.fire('playSpatialAudio', {
                key: 'flame',
                x: brazier.x,
                y: brazier.y,
                radius: 32,
                loop: true,
                volume: 0.3,
            });

            setTimeout(() => {
                this.events.fire('playAudio', { key: 'music4', volume: 0.7 });
            }, 500);

            setTimeout(() => {
                this.scene.cameras.main.stopFollow();
                this.scene.cameras.main.pan(471, 396, 3000, 'Quad.easeInOut', false, (camera: any, progress: number) => {
                    if (progress !== 1) {
                        return;
                    }

                    setTimeout(() => {
                        // Open eye.
                        const eye: Phaser.GameObjects.Sprite = this.eyes[0].getData('eye');
                        eye.setTexture('textures', 'eyeOpen');
                        this.events.fire('playAudio', { key: 'eyeOpen' });

                        // Mask.
                        this.events.fire('addMask', new Phaser.Math.Vector2(eye.x, eye.y));
                        this.events.fire('increaseSaturation');

                        // Particles.
                        const particles = this.scene.add.particles('textures', 'whiteParticle');
                        const emitter = particles.createEmitter({
                            alpha: { start: 1, end: 0 },
                            gravityY: 20,
                            speed: { max: 10, min: 15 },
                            quantity: 3,
                            frequency: -1,
                            lifespan: 2000,
                            emitZone: {
                                type: 'random',
                                source: new Phaser.Geom.Circle(eye.x, eye.y, 8),
                                quantity: 100,
                                stepRate: 0,
                                yoyo: false,
                                seamless: true,
                            },
                        });
                        emitter.setPosition(eye.x * this.constants.SCALE, eye.y * this.constants.SCALE);
                        emitter.setScale(this.constants.SCALE);
                        particles.setDepth(this.constants.OBJECT_DEPTH);
                        emitter.explode(100, 0, 0);

                        // Fade out, then pan to cave brazier.
                        setTimeout(() => {
                            this.scene.cameras.main.fadeOut(400);

                            setTimeout(() => {
                                this.scene.cameras.main.setScroll(656, 310 - 32);
                                this.scene.cameras.main.fadeIn(400);
                                this.scene.cameras.main.pan(825, 310, 8000, 'Linear', false);

                                setTimeout(() => {
                                    // Fade out, then pan to beach brazier.
                                    this.scene.cameras.main.fadeOut(400);

                                    setTimeout(() => {
                                        this.events.fire('disableMask');
                                        this.scene.cameras.main.setScroll(1177, 195 - 32);
                                        this.scene.cameras.main.fadeIn(400);
                                        this.scene.cameras.main.pan(1308, 195, 8000, 'Linear', false);

                                        setTimeout(() => {
                                            // Fade out, then pan to village brazier.
                                            this.scene.cameras.main.fadeOut(400);

                                            setTimeout(() => {
                                                this.scene.cameras.main.setScroll(376, 188 - 32);
                                                this.scene.cameras.main.fadeIn(400);
                                                this.scene.cameras.main.pan(164, 188, 8000, 'Linear', false);

                                                setTimeout(() => {
                                                    // Fade out, then pan to beach brazier.
                                                    this.scene.cameras.main.fadeOut(400);

                                                    setTimeout(() => {
                                                        this.scene.changeScene('map');
                                                    }, 6000);
                                                }, 11000);
                                            }, 500);
                                        }, 7600);
                                    }, 500);
                                }, 7600);
                            }, 500);
                        }, 3000);
                    }, 3000);
                });
            }, 2000);
        });
    }
}
