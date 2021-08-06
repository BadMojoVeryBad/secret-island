export interface TilemapStrategyInterface {
    getProperty<T>(obj: Phaser.Types.Tilemaps.TiledObject, name: string, defaultValue?: T): T;
}
