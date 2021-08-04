import { Container } from 'inversify';
import { ComponentInterface } from './componentInterface';
import { EventsInterface } from './utilities/eventsInterface';
import { Inversify } from './utilities/inversify';
import { InversifyInterface } from './utilities/inversifyInterface';

enum Hook {
    BEFORE_CREATE,
    CREATE,
    AFTER_CREATE,
    BEFORE_UPDATE,
    UPDATE,
    AFTER_UPDATE,
}

/**
 * A wrapper around Phaser.Scene to implement the concept of components.
 */
export abstract class Scene extends Phaser.Scene {
    private components: Array<ComponentInterface> = [];
    private container: Container;

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        const inversify: InversifyInterface = new Inversify();
        this.container = inversify.getInversifyContainer();
    }

    /**
     * Sets the DI container for this scene. Used by the framework to
     * enable dependency injection in components.
     *
     * @param container The Inversify container.
     */
     public setContainer(container: Container): void {
        this.container = container;
    }

    /**
     * Returns the Inversify DI container.
     *
     * @returns The Inversify DI container.
     */
    public getContainer(): Container {
        return this.container;
    }

    /**
     * Change the phaser scene safely by removing all events and
     * components of that scene, then starting the new one.
     *
     * @param key The name of the scene to start.
     */
    public changeScene(key: string): void {
        const events = this.container.get<EventsInterface>('EventsInterface');
        events.get().offAll();
        this.components = [];
        this.scene.start(key);
    }

    /**
     * Adds a component to the scene.
     *
     * @param key The key used when registering the component during the
     *     bootstrapping process.
     */
    protected addComponent(key: string, data?: Map<string, string>): void {
        const component = this.container.get<ComponentInterface>(key);
        component.setScene(this);
        component.init(data);
        this.components.push(component);
    }

    /**
     * If this scene has components, you should call this in the `create()`
     * method of your scene. This runs the create methods of all components
     * registered in this scene.
     */
    protected createComponents(): void {
        for (const component of this.components) {
            this.updateComponentTree(component, Hook.BEFORE_CREATE);
        }

        for (const component of this.components) {
            this.updateComponentTree(component, Hook.CREATE);
        }

        for (const component of this.components) {
            this.updateComponentTree(component, Hook.AFTER_CREATE);
        }
    }

    /**
     * If this scene has components, you should call this in the `update()`
     * method of your scene. This runs the create methods of all components
     * registered in this scene.
     */
    protected updateComponents(time: number, delta: number): void {
        for (const component of this.components) {
            this.updateComponentTree(component, Hook.BEFORE_UPDATE, time, delta);
        }

        for (const component of this.components) {
            this.updateComponentTree(component, Hook.UPDATE, time, delta);
        }

        for (const component of this.components) {
            this.updateComponentTree(component, Hook.AFTER_UPDATE, time, delta);
        }
    }

    private updateComponentTree(component: ComponentInterface, hook: Hook, time = 0, delta = 0) {
        switch (hook as Hook) {
            case Hook.BEFORE_CREATE:
                component.beforeCreate();
                break;

            case Hook.CREATE:
                component.create();
                break;

            case Hook.AFTER_CREATE:
                component.afterCreate();
                break;

            case Hook.BEFORE_UPDATE:
                component.beforeUpdate(time, delta);
                break;

            case Hook.UPDATE:
                component.update(time, delta);
                break;

            case Hook.AFTER_UPDATE:
                component.afterUpdate(time, delta);
                break;
        }

        for (const child of component.children()) {
            this.updateComponentTree(child, hook, time, delta);
        }
    }
}
