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
        this.addComponent('braziers');
        this.addComponent('houses');
        this.addComponent('fences');
        this.addComponent('grass');
        this.addComponent('palmTrees');
        this.addComponent('invisibleWalls');
        this.addComponent('npcs');
        this.addComponent('barrier1');
        this.addComponent('barrier2');
        this.addComponent('barrier3');
        this.addComponent('start');
        this.addComponent('directionArrows');
        this.addComponent('platforms');
        this.addComponent('eventZones');
        this.addComponent('playerLight');

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
