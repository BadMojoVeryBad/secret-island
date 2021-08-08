import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { Control } from '../../../framework/controls/Control';
import { ControlsInterface } from '../../../framework/controls/ControlsInterface';
import { KeyboardInput } from '../../../framework/controls/inputs/KeyboardInput';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class Start extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private fences: Phaser.GameObjects.Sprite[] = [];
    private controls: ControlsInterface;
    private activated = false;
    private rectangle: Phaser.GameObjects.Rectangle;
    private start: Phaser.GameObjects.Sprite;

    constructor(@inject('ControlsInterface') controls: ControlsInterface, @inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.controls = controls;
        this.controls.registerInputs(Control.ACTIVATE, [ new KeyboardInput(90) ]);
    }

    public create(): void {
        this.events.fire('disableControls');
        const rect = this.scene.add.rectangle(32, 32, 64, 64, 0x000000, 1)
        rect.setScrollFactor(0);
        rect.setDepth(this.constants.HUD_DEPTH);
        this.rectangle = rect;
        const start = this.scene.add.sprite(32, 32, 'textures', 'start');
        start.setScrollFactor(0);
        start.setDepth(this.constants.HUD_DEPTH + 1);
        this.start = start;
    }

    public update(): void {
        if (this.controls.isActive(Control.ACTIVATE) && !this.activated) {
            this.activated = true;

            setTimeout(() => {
                this.scene.tweens.add({
                    targets: this.start,
                    alpha: { from: 1, to: 0 },
                    ease: 'Linear',
                    duration: 2000,
                    repeat: 0,
                    yoyo: false
                });

                this.scene.tweens.add({
                    targets: this.rectangle,
                    alpha: { from: 1, to: 0 },
                    ease: 'Linear',
                    duration: 2000,
                    repeat: 0,
                    yoyo: false,
                    onComplete: () => {
                        this.events.fire('enableControls');
                    }
                });
            }, 500);
        }
    }
}
