import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class Audio extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private static sounds: Phaser.Sound.BaseSound[] = [];

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('playAudio', (config: any) => {
            for (const sound of Audio.sounds) {
                if (sound.key === config.key) {
                    if (!sound.isPlaying) {
                        sound.play();
                    }
                    return;
                }
            }

            const sound = this.scene.sound.add(config.key, config);
            Audio.sounds.push(sound);
            sound.play();
        });
    }
}
