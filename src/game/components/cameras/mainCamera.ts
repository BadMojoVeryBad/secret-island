import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';
import { Vignette } from '../../pipelines/vignette';
import { PlayerData } from '../player';
import { SoftLight } from '../../pipelines/softLight';

/**
 * The camera that follows the player in-game.
 */
@injectable()
export class MainCamera extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private hasCustomCameraBounds = false;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        // Add shader effects.
        this.logger.info('Adding shader effects to player.');
        this.scene.cameras.main.setPostPipeline([Vignette, SoftLight]);
        this.scene.cameras.main.fadeIn(500, 0, 0, 0);

        // Listen to events.
        this.logger.info('Listening to "playerCreated" event.');
        this.events.on('playerCreated', (player: PlayerData) => {
            // Set camera to follow player.
            this.logger.info('Setting up camera to follow player.');
            this.scene.cameras.main.setZoom(this.constants.CAMERA_ZOOM);
            this.scene.cameras.main.startFollow(player.sprite);
            this.scene.cameras.main.setLerp(this.constants.CAMERA_LERP);
        });

        this.logger.info('Listening to "playerStart" event.');
        this.events.on('playerStart', (event: Phaser.Types.Tilemaps.TiledObject) => {
            this.logger.info('Setting start position of "MainCamera".');
            this.scene.cameras.main.setScroll((event.x * this.constants.SCALE) - (this.scene.game.config.width as number / 2) + 32, (event.y * this.constants.SCALE) - (this.scene.game.config.height as number / 2) - 16);
        });

        this.logger.info('Listening to "mapCreated" event.');
        this.events.on('mapCreated', (map: Phaser.Tilemaps.Tilemap) => {
            // Make sure camera can't go outside of map.
            if (!this.hasCustomCameraBounds) {
                this.scene.cameras.main.setBounds(this.constants.ZERO, this.constants.ZERO, map.widthInPixels * this.constants.SCALE, map.heightInPixels * this.constants.SCALE);
            }
        });

        this.logger.info('Listening to "mapBounds" event.');
        this.events.on('mapBounds', (event: Phaser.Types.Tilemaps.TiledObject) => {
            // Make sure camera can't go outside of map.
            this.scene.cameras.main.setBounds(event.x * this.constants.SCALE, (event.y - event.height) * this.constants.SCALE, event.width * this.constants.SCALE, event.height * this.constants.SCALE);
            this.hasCustomCameraBounds = true;
        });
    }
}
