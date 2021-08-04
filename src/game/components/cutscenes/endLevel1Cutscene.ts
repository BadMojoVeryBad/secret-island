import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class EndLevel1Cutscene extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('endLevel1Cutscene', () => {
            // The cutscene script.
            this.scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress: number) => {
                if (progress === 1) {
                    this.scene.changeScene('title');
                }
            });
        });
    }
}
