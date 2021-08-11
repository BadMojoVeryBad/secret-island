import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { TilemapStrategyInterface } from '../../strategies/tilemapStrategyInterface';
import { Constants } from '../../utilities/constants';

class AmbientSound {
    public key: string;
    public rectangle: Phaser.Geom.Rectangle;
    public isPlaying: boolean = false;
}

@injectable()
export class Audio extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private static sounds: Phaser.Sound.BaseSound[] = [];
    private ambientSounds: AmbientSound[] = [];
    private tilemapStrategy: TilemapStrategyInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants, @inject('TilemapStrategyInterface') tilemapStrategy: TilemapStrategyInterface) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.tilemapStrategy = tilemapStrategy;
    }

    public create(): void {
        this.events.on('playAudio', (config: any) => {
            const sound = this.getSound(config);
            sound.play();
        });

        this.events.on('ambientSound', (event: Phaser.Types.Tilemaps.TiledObject) => {
            // Create a rectangle for the camera to collide with.
            const rectangle = new Phaser.Geom.Rectangle(event.x, event.y - event.height, event.width, event.height);

            // Create object.
            const ambientSound = new AmbientSound();
            ambientSound.rectangle = rectangle;
            ambientSound.key = this.tilemapStrategy.getProperty<string>(event, 'sound');
            this.ambientSounds.push(ambientSound);

            // Create sound.
            const sound = this.getSound({
                key: ambientSound.key,
                loop: true,
                volume: (ambientSound.key === 'ambientCave') ? 0.4 : 0.2,
            });
        });
    }

    public update(): void {
        const cameraPosition = new Phaser.Math.Vector2(this.scene.cameras.main.scrollX + 32, this.scene.cameras.main.scrollY + 32);

        // For each ambient sound, check if the camera is inside the
        // rectangle. If it is, fade sound in, if not, fade music out.
        for (const ambientSound of this.ambientSounds) {
            const sound = this.getSound({
                key: ambientSound.key,
                loop: true,
                volume: 0.4,
            });

            // console.log(ambientSound.rectangle);
            if (ambientSound.rectangle.contains(cameraPosition.x, cameraPosition.y)) {
                if (!ambientSound.isPlaying) {
                    console.log('playing: ' + ambientSound.key);
                    sound.play();
                    ambientSound.isPlaying = true;
                    this.scene.tweens.add({
                        targets: sound,
                        volume: { from: 0, to: (ambientSound.key === 'ambientCave') ? 0.4 : 0.2 },
                        duration: 500
                    })
                }
            } else {
                if (ambientSound.isPlaying) {
                    console.log('stopping: ' + ambientSound.key);
                    ambientSound.isPlaying = false;
                    this.scene.tweens.add({
                        targets: sound,
                        volume: { from: (ambientSound.key === 'ambientCave') ? 0.4 : 0.2, to: 0 },
                        duration: 500,
                        onComplete: () => {
                            sound.stop();
                        }
                    })
                }
            }
        }
    }

    private getSound(config: any): Phaser.Sound.BaseSound {
        for (const sound of Audio.sounds) {
            if (sound.key === config.key) {
                return sound;
            }
        }

        const sound = this.scene.sound.add(config.key, config);
        Audio.sounds.push(sound);
        return sound;
    }
}
