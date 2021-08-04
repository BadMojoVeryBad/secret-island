import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';
import { Vignette } from '../../pipelines/vignette';
import { SoftLight } from '../../pipelines/softLight';

/**
 * A camera that can be controlled manually.
 */
@injectable()
export class DebugCamera extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    private controlsActive = true;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        // Add shader effects.
        this.logger.info('Adding shader effects to player.');
        this.scene.cameras.main.setPostPipeline([Vignette]);

        // Camera controls.
        const cursors = this.scene.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.scene.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 0.1
        };
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        // Toggle the controls.
        const toggle = this.scene.input.keyboard.addKey('C');
        toggle.on('down', () => {
            this.controlsActive = !this.controlsActive;
        });

        // Listen to events.
        this.logger.info('Listening to "playerStart" event.');
        this.events.on('playerStart', (event: Phaser.Types.Tilemaps.TiledObject) => {
            this.logger.info('Setting start position of "DebugCamera".');
            this.scene.cameras.main.setScroll(event.x * this.constants.SCALE, event.y * this.constants.SCALE);
        });
    }

    public update(time: number, delta: number): void {
        if (this.controlsActive) {
            this.controls.update(delta);
        }
    }
}
