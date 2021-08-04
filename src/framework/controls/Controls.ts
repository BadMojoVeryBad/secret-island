import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../utilities/loggerInterface';
import { Control } from './Control';
import { ControlsInterface } from './ControlsInterface';
import { InputInterface } from './inputs/InputInterface';

/**
 * @inheritdoc
 */
@injectable()
export class Controls implements ControlsInterface {
    private controlMap: { [index: number]: InputInterface[] } = {};
    private logger: LoggerInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface) {
        this.logger = logger;
    }

    /**
     * @inheritdoc
     */
    public registerInputs(control: Control, inputs: InputInterface[]): void {
        this.logger.info('Registering inputs for control: ' + control);
        this.registerControl(control);
        this.controlMap[control] = inputs;
    }

    /**
     * @inheritdoc
     */
    public isActive(control: Control): number {
        const inputs = this.controlMap[control.valueOf()];
        let active = 0;

        // For each input in this control.
        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                // Store how active it is.
                const current = inputs[i].isActive();
                if (current > active) {
                    active = current;
                }
            }
        }

        // Return the most active the control.
        return active;
    }

    private registerControl(control: Control): void {
        for (const controlKey in this.controlMap) {
            if (controlKey === control.valueOf().toString()) {
                return;
            }
        }

        this.controlMap[control] = [];
    }
}
