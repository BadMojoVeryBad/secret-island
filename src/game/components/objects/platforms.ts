import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { Control } from '../../../framework/controls/Control';
import { ControlsInterface } from '../../../framework/controls/ControlsInterface';
import { KeyboardInput } from '../../../framework/controls/inputs/KeyboardInput';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class Platforms extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private platforms: any[] = [];
    private player: PlayerData;
    private controls: ControlsInterface;
    private lastDisabled: number = 0;

    constructor(@inject('ControlsInterface') controls: ControlsInterface, @inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.controls = controls;
        this.controls.registerInputs(Control.DOWN, [ new KeyboardInput(40), new KeyboardInput(83) ]);
    }

    public create(): void {
        this.events.on('platform', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.physics.add.staticSprite((event.x + event.width * this.constants.HALF) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE, 'textures', 'platform');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH + 2);
            this.platforms.push(sprite);

            if (this.player) {
                this.scene.physics.add.collider(this.player.sprite, sprite);
            }
        });

        this.events.on('largePlatform', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite((event.x + 4) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE, 'textures', 'platformLeft');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH + 1);
            const sprite2 = this.scene.add.sprite((event.x + event.width - 4) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE, 'textures', 'platformLeft');
            sprite2.setScale(this.constants.SCALE);
            sprite2.setDepth(this.constants.OBJECT_DEPTH + 1);
            sprite2.flipX = true;
            const sprite3 = this.scene.add.sprite((event.x + event.width * this.constants.HALF) * this.constants.SCALE, (event.y - event.height * this.constants.HALF) * this.constants.SCALE, 'textures', 'platformMiddle');
            sprite3.setScale(this.constants.SCALE);
            sprite3.setDepth(this.constants.OBJECT_DEPTH + 1);
            sprite3.flipX = true;
            const rectangle = this.scene.add.rectangle((event.x + event.width * this.constants.HALF) * this.constants.SCALE, (event.y - 2) * this.constants.SCALE, 8, 1, 0x607849, 0);
            rectangle.setScale(this.constants.SCALE);
            rectangle.setDepth(this.constants.OBJECT_DEPTH + 1);
            this.scene.physics.add.existing(rectangle, true);
            (rectangle.body as Phaser.Physics.Arcade.StaticBody).setSize(24, 3);
            this.platforms.push(rectangle);

            if (this.player) {
                this.scene.physics.add.collider(this.player.sprite, rectangle);
            }
        });

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;

            if (this.platforms.length > 0) {
                for (const platform of this.platforms) {
                    this.scene.physics.add.collider(player.sprite, platform);
                }
            }
        });
    }

    public update(time: number): void {
        for (const platform of this.platforms) {
            const enabled = (this.player.sprite.y < platform.y - 1.5) && this.lastDisabled + 100 < time;
            (platform.body as Phaser.Physics.Arcade.StaticBody).enable = enabled;
        }

        if (this.controls.isActive(Control.DOWN)) {
            this.lastDisabled = time;
        }
    }
}
