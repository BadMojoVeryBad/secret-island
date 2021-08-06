import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class Grass extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private grass: Phaser.GameObjects.Sprite[] = [];
    private player: PlayerData;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.events.on('grass', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'grass4');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            this.scene.physics.add.existing(sprite, true);
            sprite.setData('active', false);
            this.grass.push(sprite);
        });

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;
        });
    }


    public update(): void {
        for (let i = 0; i < this.grass.length; i++) {
            const grass = this.grass[i];
            const collide = this.scene.physics.overlap(grass, this.player.sprite);

            if (collide && !grass.getData('active')) {
                grass.anims.play('grass', true);
                grass.setData('active', true);
            } else if (!collide && grass.getData('active')) {
                grass.setData('active', false);
            }
        }
    }
}
