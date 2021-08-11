import { Component } from '../../../framework/component';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class Level extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private map: Phaser.Tilemaps.Tilemap;
    private levelName = '';

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public init(data: Map<string, string>): void {
        // Nested components.

        // This component adds cutscenes to the level.
        // this.addComponent('cutscenes');

        // The level name.
        this.levelName = data.get('name');
    }

    public create(): void {
        this.logger.info('Running "create()" for "Level".');

        // Make map.
        this.logger.info('Creating map for level.');
        this.map = this.scene.make.tilemap({ key: this.levelName });
        const tiles = this.map.addTilesetImage('tiles', 'tiles', this.constants.TILE_SIZE, this.constants.TILE_SIZE, this.constants.TILE_MARGIN, this.constants.TILE_SPACING);
        const layer = this.map.createLayer('tiles', tiles);
        layer.setDepth(this.constants.MAP_DEPTH);
        const layer2 = this.map.createLayer('foregroundTiles', tiles);
        layer2.setDepth(this.constants.OBJECT_DEPTH + this.constants.ONE);
        const layer3 = this.map.createLayer('backgroundTiles', tiles);
        layer3.setDepth(this.constants.PLAYER_DEPTH - 4);
        this.map.setCollision([1, 39, 24, 29, 25, 26, 27, 12, 13, 18, 11, 21, 22, 23], true, true, 'tiles');

        // Debug graphics.
        // const debugGraphics = this.scene.add.graphics();
        // debugGraphics.setScale(1);
        // debugGraphics.setDepth(this.constants.DEBUG_DEPTH);
        // const style: Phaser.Types.Tilemaps.StyleConfig = {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(255, 98, 0, 50),
        //     faceColor: new Phaser.Display.Color(255, 98, 0, 150)
        // };
        // this.map.renderDebug(debugGraphics, style, 'tiles');

        // Listen to events.
        this.logger.info('Listening to "playerCreated" event.');
        this.events.on('playerCreated', (player: PlayerData) => {
            this.logger.info('Adding collision between player and level.');
            this.scene.physics.add.collider(player.sprite, layer);
        });

        // this.events.fire('playAudio', {
        //     key: 'ambientIsland',
        //     loop: true,
        //     volume: 2.5,
        // });
    }

    public afterCreate(): void {
        this.logger.info('Running "afterCreate()" for "Level".');

        // Fire the events of the map.
        const events: Phaser.Types.Tilemaps.TiledObject[] = this.map.getObjectLayer('events').objects;
        for (const event of events) {
            this.logger.info('Firing "' + event.name + '" event.');
            this.events.fire(event.name, event);
        }

        // Fire a 'mapCreated' event.
        this.events.fire('mapCreated', this.map);
    }
}
