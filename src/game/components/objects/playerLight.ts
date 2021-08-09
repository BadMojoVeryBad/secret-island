import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class PlayerLight extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private player: PlayerData;
    private masks: Phaser.Math.Vector2[] = [];
    private cavePlantMasks: Phaser.Math.Vector2[] = [];
    private caveWaterMasks: Phaser.Math.Vector2[] = [];
    private rt: Phaser.GameObjects.RenderTexture;
    private rect: Phaser.GameObjects.Rectangle;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
    }

    public create(): void {
        // const sprite = this.scene.add.rectangle(this.constants.ZERO + 32, this.constants.ZERO + 32, 64, 64, 0x000000, 1);
        // sprite.setScale(this.constants.SCALE);
        // sprite.setDepth(this.constants.HUD_DEPTH - 1);
        // sprite.setScrollFactor(0);
        // this.playerLight = sprite;
        // this.playerLight.setAlpha(0);

        // this.playerLightMask = this.scene.make.image({
        //     x: 64,
        //     y: 64,
        //     key: 'textures',
        //     frame: 'light',
        //     add: false
        // });

        // this.playerLight.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.playerLightMask);
        // this.playerLight.mask.invertAlpha = true;

        // Create render texture.
        this.rt = this.scene.add.renderTexture(0, 0, 1400, 600);
        this.rt.setScale(this.constants.SCALE);
        this.rt.setDepth(this.constants.HUD_DEPTH - 1);
        this.rt.setVisible(false);

        // Create shadow with render texture as mask.
        this.rect = this.scene.add.rectangle(700, 300, 1400, 600, 0x000000, 0.5);
        this.rect.setScale(this.constants.SCALE);
        this.rect.setDepth(this.constants.HUD_DEPTH - 1);
        this.rect.setMask(this.rt.createBitmapMask());
        this.rect.mask.invertAlpha = true;
        this.rect.setAlpha(0);
        // this.rect.setVisible(false);

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;
        });

        this.events.on('addPlayerLight', () => {
            this.scene.tweens.add({
                targets: this.rect,
                alpha: { from: 0, to: 1 },
                ease: 'Linear',
                duration: 200,
                repeat: 0,
                yoyo: false
            });
        });

        this.events.on('addMask', (data: Phaser.Math.Vector2) => {
            this.masks.push(data);
        });

        this.events.on('addCavePlantMask', (data: Phaser.Math.Vector2) => {
            this.cavePlantMasks.push(data);
        });

        this.events.on('addCaveWaterMask', (data: Phaser.Math.Vector2) => {
            this.caveWaterMasks.push(data);
        });

        this.events.on('disableMask', (data: Phaser.Math.Vector2) => {
            this.rect.setAlpha(0);
        });

        this.scene.events.on('postupdate', () => {
            // Add player mask.
            const mask = this.scene.make.image({
                x: this.player.sprite.body.x,
                y: this.player.sprite.body.y,
                key: 'textures',
                frame: 'light',
                add: false
            });
            this.rt.draw(mask);
        });
    }

    public update(): void {
        this.rt.clear();

        // Add otehr masks.
        for (const mask of this.masks) {
            const maskImage = this.scene.make.image({
                x: mask.x,
                y: mask.y,
                key: 'textures',
                frame: 'light',
                add: false
            });
            this.rt.draw(maskImage);
        }

        // Add otehr masks.
        for (const mask of this.cavePlantMasks) {
            const maskImage = this.scene.make.image({
                x: mask.x,
                y: mask.y,
                key: 'textures',
                frame: 'caveplantGlow',
                add: false
            });
            this.rt.draw(maskImage);
        }

        // Add otehr masks.
        for (const mask of this.caveWaterMasks) {
            const maskImage = this.scene.make.image({
                x: mask.x,
                y: mask.y,
                key: 'textures',
                frame: 'caveWaterGlow',
                add: false
            });
            this.rt.draw(maskImage);
        }
    }
}
