import { Scene } from '../../framework/scene';

export class Gameplay extends Scene {
    private levelName: string;

    constructor(levelName: string) {
        super(levelName);

        this.levelName = levelName;
    }

    public init(): void {
        this.addComponent('player');
        this.addComponent('mainCamera');
        this.addComponent('backgrounds');

        // Add the "level" component with the level name so it
        // can load the lorrect tiled maps.
        const data = new Map();
        data.set('name', this.levelName);
        this.addComponent('level', data);
    }

    public create(): void {
        this.createComponents();
    }

    public update(time: number, delta: number): void {
        this.updateComponents(time, delta);
    }
}
