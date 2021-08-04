import { injectable } from 'inversify';

@injectable()
export class Constants {
    // Numbers that should really never change but define them here anyway.
    public readonly ZERO = 0;
    public readonly ONE = 1;
    public readonly NEGATIVE_ONE = -1;
    public readonly HALF = 0.5;

    // Game-specific constants.
    public readonly SCALE = 1;
    public readonly TILE_SIZE = 8;
    public readonly TILE_SPACING = 4;
    public readonly TILE_MARGIN = 4;

    // Player constants.
    public readonly PLAYER_HORIZONAL_VELOCITY = 60;
    public readonly PLAYER_HORIZONAL_VELOCITY_MAX = 60;
    public readonly PLAYER_VERTICAL_VELOCITY = 140;
    public readonly PLAYER_VERTICAL_VELOCITY_MAX = 140;
    public readonly PLAYER_GRAVITY_MODIFIER = 0;
    public readonly PLAYER_JUMP_DELAY = 100;

    // Camera constants.
    public readonly CAMERA_ZOOM = 1;
    public readonly CAMERA_LERP = 0.2;

    // Depths of the various things in the game.
    public readonly BACKGROUND1_DEPTH = 10;
    public readonly BACKGROUND2_DEPTH = 20;
    public readonly BACKGROUND3_DEPTH = 30;
    public readonly BACKGROUND4_DEPTH = 40;
    public readonly BACKGROUND5_DEPTH = 50;
    public readonly BACKGROUND6_DEPTH = 60;
    public readonly BACKGROUND7_DEPTH = 70;
    public readonly BACKGROUND8_DEPTH = 80;
    public readonly BACKGROUND9_DEPTH = 90;
    public readonly PLAYER_DEPTH = 100;
    public readonly MAP_DEPTH = 110;
    public readonly OBJECT_DEPTH = 120;
    public readonly TEXT_DEPTH = 130;
    public readonly DEBUG_DEPTH = 1000;
}
