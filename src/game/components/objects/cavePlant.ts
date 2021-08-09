import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class CavePlant extends Component {
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
        this.events.on('cavePlant', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const number = Math.floor(Math.random() * 2) + 1;
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'caveplant' + number);
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            this.fences.push(sprite);

            let y = (number === 2) ? 5 : 6;
            if (sprite.flipY) {
                y = (number === 2) ? 3 : 3;
            }

            this.events.fire('addCavePlantMask', new Phaser.Math.Vector2(event.x + 3, event.y - y));
        });
    }
}
