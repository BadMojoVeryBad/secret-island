import { Vignette } from '../game/pipelines/vignette';
import { SoftLight } from '../game/pipelines/softLight';
import { HSL } from '../game/pipelines/hsl';

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
            tileBias: 8,
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
        HSL,
    ]
};
