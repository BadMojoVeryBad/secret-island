import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class Crabs extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private crabs: Phaser.GameObjects.Sprite[] = [];

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('crab', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'crab1');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.PLAYER_DEPTH);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            sprite.anims.play('crab');
            sprite.setAlpha(0);
            this.crabs.push(sprite);
        });

        this.events.on('lightBrazier4', () => {
            for (const crab of this.crabs) {
                crab.setAlpha(1);
            }
        });
    }
}
