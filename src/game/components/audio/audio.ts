import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { MathHelperInterface } from '../../../framework/utilities/mathHelperInterface';
import { TilemapStrategyInterface } from '../../strategies/tilemapStrategyInterface';
import { Constants } from '../../utilities/constants';

class AmbientSound {
    public key: string;
    public rectangle: Phaser.Geom.Rectangle;
    public isPlaying: boolean = false;
}

class SpatialSound {
    public key: string;
    public circle: Phaser.Geom.Circle;
    public isPlaying: boolean = false;
    public sound: Phaser.Sound.BaseSound;
}

@injectable()
export class Audio extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private static sounds: Phaser.Sound.BaseSound[] = [];
    private ambientSounds: AmbientSound[] = [];
    private spatialSounds: SpatialSound[] = [];
    private tilemapStrategy: TilemapStrategyInterface;
    private mathHelper: MathHelperInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants, @inject('TilemapStrategyInterface') tilemapStrategy: TilemapStrategyInterface, @inject('MathHelperInterface') mathHelper: MathHelperInterface) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.tilemapStrategy = tilemapStrategy;
        this.mathHelper = mathHelper;
    }

    public create(): void {
        this.events.on('playAudio', (config: any) => {
            const sound = this.getSound(config);
            sound.play();
        });

        this.events.on('playSpatialAudio', (config: any) => {
            const spatialSound = new SpatialSound();
            spatialSound.circle = new Phaser.Geom.Circle(config.x, config.y, config.radius);
            spatialSound.key = config.key;
            spatialSound.sound = this.scene.sound.add(config.key, config);
            spatialSound.sound.play();
            this.spatialSounds.push(spatialSound);
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

        // Clean up.
        this.scene.events.on('shutdown', () => {
            for (const spatialSound of this.spatialSounds) {
                spatialSound.sound.stop();
            }
            this.spatialSounds = [];
        })
    }

    public update(): void {
        const cameraPosition = new Phaser.Math.Vector2(this.scene.cameras.main.scrollX + 32, this.scene.cameras.main.scrollY + 32);

        // For each ambient sound, check if the camera is inside the
        // rectangle. If it is, fade sound in, if not, fade music out.
        for (const ambientSound of this.ambientSounds) {
            const sound = this.getSound({
                key: ambientSound.key
            });

            // console.log(ambientSound.rectangle);
            if (ambientSound.rectangle.contains(cameraPosition.x, cameraPosition.y)) {
                if (!ambientSound.isPlaying) {
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

        for (const spatialSound of this.spatialSounds) {
            // Get distance from camera.
            const distance = cameraPosition.distance(new Phaser.Math.Vector2(spatialSound.circle.x, spatialSound.circle.y));

            // Get the volume based on radius.
            const volume = this.mathHelper.clamp(this.mathHelper.normalise(distance, 0, spatialSound.circle.radius), 0, 1);
            // @ts-ignore
            spatialSound.sound.setVolume(volume);
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
