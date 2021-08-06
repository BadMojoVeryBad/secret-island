import { Vignette } from '../game/pipelines/vignette';
import { SoftLight } from '../game/pipelines/softLight';

export default {
    type: Phaser.WEBGL,
    backgroundColor: '#000000',
    width: 64,
    height: 64,
    // scale: {
    //     mode: Phaser.Scale.ENVELOP,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    pixelArt: true,
    antialias: false,
    input: {
        gamepad: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 600
            },
            debug: false
        },
    },
    callbacks: {
        postBoot: (game) => {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
        }
    },
    pipeline: [
        Vignette,
        SoftLight,
    ]
};
