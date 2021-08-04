import { ComponentInterface } from './componentInterface';
import { Scene } from './scene';
import { injectable } from 'inversify';

@injectable()
export abstract class Component implements ComponentInterface {
    protected scene: Scene;
    private components: Array<ComponentInterface> = [];

    public init(data?: Map<string, string>): void { // eslint-disable-line @typescript-eslint/no-unused-vars
        // To be overridden.
    }

    public beforeCreate(): void {
        // To be overridden.
    }

    public create(): void {
        // To be overridden.
    }

    public afterCreate(): void {
        // To be overridden.
    }

    public beforeUpdate(time: number, delta: number): void { // eslint-disable-line @typescript-eslint/no-unused-vars
        // To be overridden.
    }

    public update(time: number, delta: number): void { // eslint-disable-line @typescript-eslint/no-unused-vars
        // To be overridden.
    }

    public afterUpdate(time: number, delta: number): void { // eslint-disable-line @typescript-eslint/no-unused-vars
        // To be overridden.
    }

    public children(): Array<ComponentInterface> {
        return this.components;
    }

    public setScene(scene: Scene): void {
        this.scene = scene;
    }

    /**
     * Adds a component to the scene.
     *
     * @param key The key used when registering the component during the
     *     bootstrapping process.
     */
    protected addComponent(key: string): void {
        const component = this.scene.getContainer().get<ComponentInterface>(key);
        component.setScene(this.scene);
        component.init();
        this.components.push(component);
    }
}
