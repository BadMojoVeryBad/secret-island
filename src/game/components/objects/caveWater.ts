import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class CaveWater extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private fences: Phaser.GameObjects.Sprite[] = [];

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('caveWater', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'caveWater');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH + 3);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            this.fences.push(sprite);

            this.events.fire('addCaveWaterMask', new Phaser.Math.Vector2(event.x + 12, event.y - 3));

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
                    source: new Phaser.Geom.Rectangle(-12, -15, 23, 23),
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
    }
}
