import { injectable } from 'inversify';
import { PhaserGameInterface } from './phaserGameInterface';

/**
 * Provides a thin layer around the phaser game object
 * to make it more DI friendly.
 */
 @injectable()
export class PhaserGame implements PhaserGameInterface {
    private static game: Phaser.Game = null;

    public getPhaserGame(): Phaser.Game {
        return PhaserGame.game;
    }

    public getPhaserScene(): Phaser.Scene {
        return PhaserGame.game.scene.getScene('_framework');
    }

    public setPhaserGame(game: Phaser.Game): void {
        if (PhaserGame.game === null) {
            PhaserGame.game = game;
            game.scene.add('_framework', Phaser.Scene);
            game.scene.start('_framework');
        }
    }

    public getTime(): number {
        return PhaserGame.game.getTime();
    }

    public getDelta(): number {
        return PhaserGame.game.loop.delta;
    }
}
