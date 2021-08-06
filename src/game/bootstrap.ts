import { Game } from '../framework/game';
import { Logger } from '../framework/utilities/logger';
import { LoggerInterface } from '../framework/utilities/loggerInterface';
import { Preload } from './scenes/preload';
import { Load } from './scenes/load';
import { Player } from './components/player';
import { Level } from './components/levels/level';
import { Gameplay } from './scenes/gameplay';
import { Constants } from './utilities/constants';
import { Cutscenes } from './components/cutscenes/cutscenes';
import { EndLevel1Cutscene } from './components/cutscenes/endLevel1Cutscene';
import { MainCamera } from './components/cameras/mainCamera';
import { DebugCamera } from './components/cameras/debugCamera';
import { Backgrounds } from './components/objects/backgrounds';
import { PlayerStrategyInterface } from './strategies/playerStrategyInterface';
import { PlayerStrategy } from './strategies/playerStrategy';
import { ControlsInterface } from '../framework/controls/ControlsInterface';
import { Controls } from '../framework/controls/Controls';
import { Braziers } from './components/objects/braziers';
import { Houses } from './components/objects/houses';
import { Fences } from './components/objects/fences';
import { InvisibleWalls } from './components/objects/invisibleWalls';
import { NPCs } from './components/objects/npcs';
import { Grass } from './components/objects/grass';
import { TilemapStrategyInterface } from './strategies/tilemapStrategyInterface';
import { TilemapStrategy } from './strategies/tilemapStrategy';
import { PalmTrees } from './components/objects/palmTrees';

/**
 * Bootstrap the game here.
 */
export default class Bootstrap extends Game {

    public bootstrap(): void {
        // Add scenes to the game here.
        this.addScene('preload', new Preload());
        this.addScene('load', new Load());
        this.addScene('map', new Gameplay('map'));

        // Add components to the game here.
        this.addComponent('player', Player);
        this.addComponent('level', Level);
        this.addComponent('backgrounds', Backgrounds);
        this.addComponent('braziers', Braziers);
        this.addComponent('houses', Houses);
        this.addComponent('fences', Fences);
        this.addComponent('invisibleWalls', InvisibleWalls);
        this.addComponent('npcs', NPCs);
        this.addComponent('grass', Grass);
        this.addComponent('palmTrees', PalmTrees);
        this.addComponent('mainCamera', MainCamera);
        this.addComponent('debugCamera', DebugCamera);

        // Cutscenes components.
        this.addComponent('cutscenes', Cutscenes);
        this.addComponent('endLevel1Cutscene', EndLevel1Cutscene);

        // Add other dependency injection bindings here.
        this.bind<LoggerInterface>('LoggerInterface', Logger);
        this.bind<Constants>('Constants', Constants);
        this.bind<PlayerStrategyInterface>('PlayerStrategyInterface', PlayerStrategy);
        this.bind<TilemapStrategyInterface>('TilemapStrategyInterface', TilemapStrategy);
        this.bind<ControlsInterface>('ControlsInterface', Controls);
    }
}
