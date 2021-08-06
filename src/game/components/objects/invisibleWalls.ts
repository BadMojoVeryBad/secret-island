import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class InvisibleWalls extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private walls: Phaser.GameObjects.Rectangle[] = [];
    private player: PlayerData;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('invisibleWall', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const rect = this.scene.add.rectangle((event.x + event.width * this.constants.HALF) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE, event.width, event.height, 0x000000, 0);
            this.scene.physics.add.existing(rect, true);
            this.walls.push(rect);

            if (this.player) {
                this.scene.physics.add.collider(this.player.sprite, rect);
            }
        });

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;

            if (this.walls.length > 0) {
                for (const wall of this.walls) {
                    this.scene.physics.add.collider(player.sprite, wall);
                }
            }
        });
    }
}
