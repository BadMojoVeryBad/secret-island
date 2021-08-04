/**
 * Bootstraps the Phaser 3 game by adding all scenes to the game, and starting
 * the first scene. This class also allows you to add components and events
 * to the game, as well as other bindings to the service container.
 *
 * This interface ensures the bootstrap method exists, as the game cannot be
 * created without it.
 */
export interface GameInterface {
    /**
     * In this method, you will define the scenes, events, components, and
     * other bindings the game needs to run. It will be caled when the
     * framework is setting up the game.
     */
    bootstrap(): void;
}
