import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';

@injectable()
export class Backgrounds extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private cursors: any;
    private background: any;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.events.on('mapCreated', (map: Phaser.Tilemaps.Tilemap) => {
            this.background = this.scene.add.tileSprite(this.constants.ZERO, this.constants.ZERO, map.widthInPixels * this.constants.SCALE, map.heightInPixels * this.constants.SCALE, 'textures', 'clouds1');
            this.background.setScale(this.constants.SCALE);
            this.background.setScrollFactor(this.constants.BACKGROUND3_DEPTH * 0.01, -0.2);
            this.background.setDepth(this.constants.BACKGROUND3_DEPTH);
            this.background.height = 64; // this.scene.textures.get(this.background.texture.key).get().height * this.constants.SCALE;
            this.background.y = 7;

            const background2 = this.scene.add.tileSprite(this.constants.ZERO, this.constants.ZERO, map.widthInPixels * this.constants.SCALE, map.heightInPixels * this.constants.SCALE, 'textures', 'clouds2');
            background2.setScale(this.constants.SCALE);
            background2.setScrollFactor(this.constants.BACKGROUND2_DEPTH * 0.01, -0.2);
            background2.setDepth(this.constants.BACKGROUND2_DEPTH);
            background2.height = 64;
            background2.y = 5;

            const background3 = this.scene.add.tileSprite(this.constants.ZERO, this.constants.ZERO, map.widthInPixels * this.constants.SCALE, map.heightInPixels * this.constants.SCALE, 'textures', 'ocean');
            background3.setScale(this.constants.SCALE);
            background3.setScrollFactor(this.constants.BACKGROUND4_DEPTH * 0.01, -0.2);
            background3.setDepth(this.constants.BACKGROUND4_DEPTH);
            background3.height = 64;
            background3.y = 20;

            const background4 = this.scene.add.tileSprite(this.constants.ZERO + map.widthInPixels / 2, this.constants.ZERO, map.widthInPixels * this.constants.SCALE, map.heightInPixels * this.constants.SCALE, 'textures', 'blueParticle');
            background4.setScale(this.constants.SCALE);
            background4.setScrollFactor(1);
            background4.setDepth(this.constants.BACKGROUND1_DEPTH);
        });
    }

    public update(): void {
        if (this.background && this.cursors.up.isDown) {
            // this.background.y--;
            // console.log(this.background.y);
        }
    }
}
