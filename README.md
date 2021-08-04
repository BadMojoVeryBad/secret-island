# Haydn's Phaser3/TypeScript Starter Template

## Overview
A starter template that adds TypeScript, dependency injection, events, a components system, and other useful utilities to Phaser 3.

## Prerequisites
This project uses the following dependencies:
* Node/Npm
* Yarn

## Installation
To install it you'll need to clone the repo and compile the assets:

```
git clone https://github.com/BadMojoVeryBad/phaser3-typescript-starter-template.git
cd phaser3-typescript-starter-template
yarn
yarn prod
```

You will then be able to serve the `/dist` directory with a web server and view the game!

## Documentation
Underneath it's just Phaser 3, so you can use it how you would usually would as per the Phaser docs, examples, and Rex notes. However, there's a few design/architecture concepts that are used in this template that are worth looking at:

### Linting
To lint your code, run the yarn command:
```
yarn lint
```

To automatically fix code errors:
```
yarn fix
```

### Debugging/Developing
You can watch the codebase for changes with thw `watch` command:
```
yarn watch
```

### Tests
This template has jest built in. You can run unit tests:
```
yarn test
```

### Bootstrapping the Game
A Phaser3 game is a bunch of scenes, and in our case components as well (I'll get to that!). We tell the framework about our scenes and components in `src/game/bootstrap.ts`:
```
public bootstrap(): void {
    // Add scenes to the game here.
    this.addScene('init', Init);

    // Add components to the game here.
    this.addComponent('robot', Robot);
    this.addComponent('ground', Ground);

    // Add other dependency injection bindings here.
    this.bind<LoggerInterface>('LoggerInterface', Logger);
}
```
As you can see, you can add scenes and components, as well as other services using the `bind()` method.

### Configuring the Game
Phaser 3 has it's own game config. There also some other config to set with this framework. You can find these in the `src/config` directory.

### Components
The biggest addition to Phaser 3 in this template/framework is the concept of components. Components are small sections of a scene. They have access to the scene and therefore all of the Phaser 3 API, so anything you can do in a scene, you can do in a component. They also can be nested in a tree structure.

Create compomenents in `src/game/components`. They will look like:
```
import Component from '../../framework/component';

@injectable()
export default class ChildComponent extends Component {

    ...
```

Then register it in the `src/game/bootstrap.ts`:
```
import ChildComponent from './components/childComponent';

public bootstrap(): void {
    ...

    this.addComponent('childComponent', ChildComponent);

    ...
```

Now you can add it to scenes. Make sure if your scene has components, to call `this.createComponents()` and `this.updateComponents(time, delta)`:
```
import { Scene } from '../../framework/scene';

export default class Init extends Scene {

    constructor() {
        super('init');
    }

    public init(): void {
        this.addComponent('childComponent');
    }

    public create(): void {
        this.createComponents();
    }

    public update(time: number, delta: number): void {
        this.updateComponents(time, delta);
    }
```

Now when that scene is run, everything in the component's `create()` method will run with the scene's `create()` method, and the component's `update()` method will run in the `update()` method.

Components also have before and after methods:
```
public beforeCreate(): void {
    // To be overridden.
}

public create(): void {
    // To be overridden.
}

public afterCreate(): void {
    // To be overridden.
}

public beforeUpdate(): void {
    // To be overridden.
}

public update(): void {
    // To be overridden.
}

public afterUpdate(): void {
    // To be overridden.
}
```

Finally, components can be nested. call `addComponent()` in a component's `init()` method:
```
import Component from '../../framework/component';

@injectable()
export default class ChildComponent extends Component {

    public init(): void {
        this.addComponent('anotherComponent');
    }
```


### Dependency Injection
We use InversifyJS to do dependency injection (DI). To use it, create an `injectable()` service:
```
import { injectable } from 'inversify';

@injectable()
export default class Logger implements LoggerInterface {

    ...
```

Next, bind the service to the DI Container in `src/game/bootstrap.ts`:
```
public bootstrap(): void {
    ...

    this.bind<LoggerInterface>('LoggerInterface', Logger);

    ...
}
```

Then you can inject that dependency into components, and any other class created using dependency injection:
```
@injectable()
export default class ChildComponent extends Component {
    private ground: Phaser.GameObjects.Rectangle;
    private logger: LoggerInterface;
    private events: EventsInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface) {
        super();

        // use 'logger' however you like.
    }

    ...
```

### Logging
This template has logging. To use it, inject the logger into your components:
```
@injectable()
export default class ChildComponent extends Component {
    private logger: LoggerInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface) {
        super();

        this.logger = logger;
    }

    public create(): void {
        // Log stuff!
        this.logger.info('Running "create()" for "ChildComponent".');

        ...
```

### Events
This template has a custom events interface. This means you can use events, even when the Phaser 3 scene is inaccessible.

To use it, inject the service into your components (or wherever you want!).
```
@injectable()
export default class ChildComponent extends Component {
    private logger: EventsInterface;

    constructor(@inject('EventsInterface') events: EventsInterface) {
        super();

        this.events = events;
    }

    public create(): void {
        // Fire events!
        this.events.fire('child_created', 'some data');

        ...
```

You can then listen to events elsewhere:
```
@injectable()
export default class OtherComponent extends Component {
    private logger: EventsInterface;

    constructor(@inject('EventsInterface') events: EventsInterface) {
        super();

        this.events = events;
    }

    public create(): void {
        // Listen to events.
        this.events.on('child_created', (data) => {
            console.log(data); // 'some data'
        });

        ...
```
