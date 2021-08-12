import { Component } from '../../../framework/component';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class WhiteParticles extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.logger.info('Running "create()" for "BlackParticles".');

        this.events.on('whiteParticles', (event: Phaser.Types.Tilemaps.TiledObject) => {
            this.logger.info('Adding black particles to scene.');
            const particles = this.scene.add.particles('textures', 'whiteParticle');
            const emitter = particles.createEmitter({
                alpha: { start: 1, end: 0 },
                gravityY: 0,
                speed: { max: 5, min: 25 },
                quantity: 25,
                frequency: 1000,
                lifespan: 5000,
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(0 - (event.width * this.constants.HALF * this.constants.SCALE), 0 - (event.height * this.constants.HALF * this.constants.SCALE), event.width * 4, event.height * 4),
                    quantity: 100,
                    stepRate: 0,
                    yoyo: false,
                    seamless: true,
                },
            });
            emitter.setPosition((event.x + event.width * this.constants.HALF) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE);
            emitter.setScale(this.constants.SCALE);
            emitter.setAlpha(0);
            particles.setDepth(this.constants.OBJECT_DEPTH);

            this.particles.push(emitter);
        });

        this.events.on('lightBrazier4', () => {
            for (const crab of this.particles) {
                crab.setAlpha(1);
            }
        });
    }
}
