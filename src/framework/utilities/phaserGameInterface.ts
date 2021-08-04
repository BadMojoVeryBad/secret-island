/**
 * Provides a thin layer around the phaser game object
 * to make it more DI friendly.
 */
export interface PhaserGameInterface {
    /**
     * Get the phaser game object.
     *
     * @returns The phaser game object.
     */
    getPhaserGame(): Phaser.Game;

    /**
     * Get an empty scene.
     *
     * @returns An empty scene the framework uses for it's scene-
     *          related logic.
     */
    getPhaserScene(): Phaser.Scene;

    /**
     * Sets the phaser game object.
     *
     * @param game The phaser game object.
     */
    setPhaserGame(game: Phaser.Game): void;

    /**
     * Get the game time in ms.
     */
    getTime(): number;

    /**
     * Get the step time in ms.
     */
    getDelta(): number;
}
