import { GameInterface } from './gameInterface';
import { Container } from 'inversify';
import phaserConfig from '../config/phaser';
import generalConfig from '../config/general';
import { ComponentInterface } from './componentInterface';
import { Scene } from './scene';
import { PhaserGameInterface } from './utilities/phaserGameInterface';
import { PhaserGame } from './utilities/phaserGame';
import { InversifyInterface } from './utilities/inversifyInterface';
import { Inversify } from './utilities/inversify';
import { EventsInterface } from './utilities/eventsInterface';
import { Events } from './utilities/events';
import { MathHelperInterface } from './utilities/mathHelperInterface';
import { MathHelper } from './utilities/mathHelper';

/**
 * Bootstraps the Phaser 3 game by adding all scenes to the game, and starting
 * the first scene. This class also allows you to add components and events
 * to the game, as well as other bindings to the service container.
 */
export abstract class Game implements GameInterface {
    /**
     * Stores all the scenes in the game (just in case we need them later).
     */
    private scenes: Map<string, Scene | (new (...args: unknown[]) => Scene)>;

    /**
     * Stores the phaser3 game as a member.
     */
    private phaserGame: PhaserGameInterface;

    /**
     * The inversify service container. Used for binding interfaces and
     * resolving dependencies.
     */
    private inversifyContainer: InversifyInterface;

    constructor() {
        // Initialise members. We're not using DI here as we're still
        // setting up Phaser, which is not DI-friendly.
        this.inversifyContainer = new Inversify();
        this.inversifyContainer.setInversifyContainer(new Container());
        this.phaserGame = new PhaserGame();
        this.scenes = new Map();

        // Bind services required to make the game work.
        this.bindServices();

        // Configure the game.
        this.bootstrap();

        // Start phaser.
        this.startGame();
    }

    /**
     * @inheritdoc
     */
    public bootstrap(): void {
        // To be overridden.
    }

    /**
     * Starts the Phaser 3 game by running the first scene.
     */
    protected startGame(): void {
        // Create the game.
        // @ts-ignore
        const game = new Phaser.Game(phaserConfig);

        // Add all scenes.
        this.scenes.forEach((scene, key) => {
            game.scene.add(key, scene);
        });

        // Save the game in a service we can use elsewhere.
        this.phaserGame.setPhaserGame(game);

        // Start the first scene.
        game.scene.start(generalConfig.startScene);
    }

    /**
     * Adds a scene to the game.
     *
     * @param key The string to use when registering the scene in Phaser.
     * @param scene The Phaser scene.
     */
    protected addScene(key: string, scene: Scene | (new (...args: unknown[]) => Scene)): void {
        this.scenes.set(key, scene);
    }

    /**
     * Adds a scene component to the game.
     *
     * @param key The unique string that will be used to identify this component.
     * @param component The component to register.
     */
    protected addComponent(key: string, component:  new (...args: unknown[]) => ComponentInterface): void {
        this.inversifyContainer.getInversifyContainer().bind<ComponentInterface>(key).to(component);
    }

    /**
     * Binds type <I> to an object. This is just a thin wrapper around Inversify.
     *
     * @param key A key to use when retrieving the injected service.
     * @param object The thing you're binding to.
     */
    protected bind<I>(key: string, object: new (...args: unknown[]) => I): void {
        this.inversifyContainer.getInversifyContainer().bind<I>(key).to(object);
    }

    private bindServices(): void {
        this.inversifyContainer.getInversifyContainer().bind<EventsInterface>('EventsInterface').to(Events).inSingletonScope();
        this.inversifyContainer.getInversifyContainer().bind<PhaserGameInterface>('PhaserGameInterface').to(PhaserGame).inSingletonScope();
        this.inversifyContainer.getInversifyContainer().bind<MathHelperInterface>('MathHelperInterface').to(MathHelper).inSingletonScope();
    }
}
