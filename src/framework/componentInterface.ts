import { Scene } from './scene';

/**
 * Defined the interface required to make components work.
 */
export interface ComponentInterface {
    /**
     * This is called after the object is contructed, but before create.
     * This means all dependencies will be resolved, but the actual phaser
     * logic wont have started yet.
     *
     * This is usually used to add child components with
     * `this.addComponent('myComponent')`.
     */
    init(data?: Map<string, string>): void;

    /**
     * Called during the scene's `create()` method, before all other components
     * `create()` methods have been run.
     */
    beforeCreate(): void;

    /**
     * Called during the scene's `create()` method.
     */
    create(): void;

    /**
     * Called during the scene's `create()` method, after all other components
     * `create()` methods have been run. Useful for emitting events that have
     * been subscribed to in the `create()` method.
     */
    afterCreate(): void;

    /**
     * Called during the scene's `update()` method, before all other components
     * `update()` methods have been run.
     *
     * @param time Game time in ms.
     * @param delta Frame delta in ms.
     */
    beforeUpdate(time: number, delta: number): void;

    /**
     * Called during the scene's `update()` method.
     *
     * @param time Game time in ms.
     * @param delta Frame delta in ms.
     */
    update(time: number, delta: number): void;

    /**
     * Called during the scene's `update()` method, after all other components
     * `update()` methods have been run. Useful for emitting events.
     *
     * @param time Game time in ms.
     * @param delta Frame delta in ms.
     */
    afterUpdate(time: number, delta: number): void;

    /**
     * Returns the components that are children of this component, as
     * added by `this.addComponent('myComponent')`.
     *
     * @return An array of components.
     */
    children(): Array<ComponentInterface>;

    /**
     * Sets the phaser scene member.
     *
     * @param scene The scene.
     */
    setScene(scene: Scene): void;
}
