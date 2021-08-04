import { Scene } from '../../framework/scene';

export class Preload extends Scene {
    constructor() {
        super('preload');
    }

    public preload(): void {
        // Images.
        this.load.image('loadingBar', 'assets/loadingBar.png');

        // Go to next scene when loading is done.
        this.load.on('complete', () => {
            this.scene.start('load', {});
        });
    }
}
