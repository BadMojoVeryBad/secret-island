import { Component } from '../../../framework/component';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { Constants } from '../../utilities/constants';
import { TilemapStrategyInterface } from '../../strategies/tilemapStrategyInterface';
import { PlayerData } from '../player';

@injectable()
export class EventZones extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private tilemapStrategy: TilemapStrategyInterface;
    private zones: Phaser.GameObjects.Zone[] = [];
    private player: Phaser.GameObjects.Sprite;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants, @inject('TilemapStrategyInterface') tilemapStrategy: TilemapStrategyInterface) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.tilemapStrategy = tilemapStrategy;
    }

    public create(): void {
        this.logger.info('Running "create()" for "EventZones".');

        // Listen to events.
        this.logger.info('Listening to "robotCreated" event.');
        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player.sprite;
        });

        this.logger.info('Listening to "eventZone" event.');
        this.events.on('eventZone', (event: Phaser.Types.Tilemaps.TiledObject) => {
            this.logger.info('Adding event zone to scene: ' + this.tilemapStrategy.getProperty<string>(event, 'event'));

            const zone = this.scene.add.zone(0, 0, 0, 0);
            zone.setData('event', this.tilemapStrategy.getProperty<string>(event, 'event'));
            zone.setData('triggered', false);
            zone.setPosition((event.x + event.width * this.constants.HALF) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE);
            zone.setSize(event.width * this.constants.SCALE, event.height * this.constants.SCALE);
            this.scene.physics.add.existing(zone, true);
            this.zones.push(zone);
        });
    }

    public update(): void {
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i];
            const triggered: boolean = zone.getData('triggered');
            const event: string = zone.getData('event');

            if (!triggered && this.scene.physics.overlap(this.player, zone)) {
                this.logger.info('eventZone collision. Firing event: "' + event + '"');
                this.events.fire(event);
                zone.setData('triggered',  true);
            }
        }
    }
}
