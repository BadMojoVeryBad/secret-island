import { Scene } from '../../framework/scene';
import { Constants } from '../utilities/constants';

export class Load extends Scene {
    private loader: Phaser.GameObjects.Image;
    private constants: Constants;

    constructor() {
        super('load');
        this.constants = new Constants();
    }

    public preload(): void {
        // Load audio.
        this.load.audio('ambientCave', 'assets/sfx/ambientCave.ogg');
        this.load.audio('ambientIsland', 'assets/sfx/ambientIsland.ogg');
        this.load.audio('brazier1', 'assets/sfx/brazier1.ogg');
        this.load.audio('brazier2', 'assets/sfx/brazier2.ogg');
        this.load.audio('brazier3', 'assets/sfx/brazier3.ogg');
        this.load.audio('brazier4', 'assets/sfx/brazier4.ogg');
        this.load.audio('flame', 'assets/sfx/flame.ogg');
        this.load.audio('eyeOpen', 'assets/sfx/eyeOpen.ogg');
        this.load.audio('dissolve', 'assets/sfx/dissolve.ogg');
        this.load.audio('step1', 'assets/sfx/step1.ogg');
        this.load.audio('step2', 'assets/sfx/step2.ogg');
        this.load.audio('step3', 'assets/sfx/step3.ogg');
        this.load.audio('stepGrass1', 'assets/sfx/stepGrass1.ogg');
        this.load.audio('stepGrass2', 'assets/sfx/stepGrass2.ogg');
        this.load.audio('stepGrass3', 'assets/sfx/stepGrass3.ogg');
        this.load.audio('stepSand1', 'assets/sfx/stepSand1.ogg');
        this.load.audio('stepSand2', 'assets/sfx/stepSand2.ogg');
        this.load.audio('stepSand3', 'assets/sfx/stepSand3.ogg');
        this.load.audio('stepFall1', 'assets/sfx/stepFall1.ogg');
        this.load.audio('stepFall2', 'assets/sfx/stepFall2.ogg');
        this.load.audio('stepFall3', 'assets/sfx/stepFall3.ogg');
        this.load.audio('music1', 'assets/music/music1.ogg');
        this.load.audio('music2', 'assets/music/music2.ogg');
        this.load.audio('music3', 'assets/music/music3.ogg');
        this.load.audio('music4', 'assets/music/music4.ogg');
        this.load.audio('npc', 'assets/sfx/npc.ogg');

        // Load images.
        this.load.image('tiles', 'assets/tiles.png');
        this.load.atlas({
            key: 'textures',
            textureURL: 'assets/textures.png',
            atlasURL: 'assets/textures.json'
        });

        // Load levels.
        this.load.tilemapTiledJSON('map', 'assets/map.json');

        // Basic graphics and loading bar.
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        this.loader = this.add.image(this.sys.game.config.width as number * this.constants.HALF, (this.sys.game.config.height as number * this.constants.HALF), 'loadingBar');
        this.loader.setScrollFactor(this.constants.ZERO);
        this.loader.setScale(this.constants.SCALE);
        this.loader.alpha = 1;

        // Progress bar.
        this.load.on('progress', (percent: number) => {
            const x = this.loader.x - (this.loader.displayWidth * this.constants.HALF) + this.constants.SCALE;
            const y = this.loader.y - (this.loader.displayHeight * this.constants.HALF) + this.constants.SCALE;
            const height = 2;
            const width = (this.loader.displayWidth - 2) * percent;
            graphics.fillRect(x, y, width, height);
        });

        // Go to next scene when loading is done.
        this.load.on('complete', () => {
            this.scene.start('map', {});
        });
    }

    public create(): void {
        this.anims.create({
            key: 'playerSitting',
            frames: this.anims.generateFrameNames('textures', { prefix: 'playerSitting', start: 1, end: 6, zeroPad: 0 }),
            frameRate: 18,
            repeat: -1,
        });

        this.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNames('textures', { prefix: 'playerStanding', start: 1, end: 6, zeroPad: 0 }),
            frameRate: 18,
            repeat: -1,
        });

        this.anims.create({
            key: 'playerRunning',
            frames: this.anims.generateFrameNames('textures', { prefix: 'playerRunning', start: 1, end: 6, zeroPad: 0 }),
            frameRate: 18,
            repeat: -1,
        });

        this.anims.create({
            key: 'playerJumping',
            frames: this.anims.generateFrameNames('textures', { prefix: 'playerRunning', start: 2, end: 2, zeroPad: 0 }),
            frameRate: 1,
            repeat: -1,
        });

        this.anims.create({
            key: 'playerFalling',
            frames: this.anims.generateFrameNames('textures', { prefix: 'playerRunning', start: 5, end: 5, zeroPad: 0 }),
            frameRate: 1,
            repeat: -1,
        });

        this.anims.create({
            key: 'brazierAlight',
            frames: this.anims.generateFrameNames('textures', { prefix: 'brazierAlight', start: 1, end: 3, zeroPad: 0 }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'npcIdle',
            frames: this.anims.generateFrameNames('textures', { prefix: 'npc', start: 1, end: 4, zeroPad: 0 }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: 'grass',
            frames: this.anims.generateFrameNames('textures', { prefix: 'grass', start: 1, end: 4, zeroPad: 0 }),
            frameRate: 12,
            repeat: 0,
        });

        this.anims.create({
            key: 'palmTree',
            frames: this.anims.generateFrameNames('textures', { prefix: 'palmTree', start: 1, end: 9, zeroPad: 0 }),
            frameRate: 12,
            repeat: -1,
        });
    }
}
