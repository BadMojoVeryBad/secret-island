import { PhaserGame } from '../../../framework/utilities/phaserGame';
import { InputInterface } from './InputInterface';

export enum Gamepad {
    ONE,
    TWO,
    THREE,
    FOUR,
}

export enum GamepadButton {
    A,
    B,
    X,
    Y,
    L1,
    R1,
    L2,
    R2,
    SELECT,
    START,
    STICK_LEFT,
    STICK_RIGHT,
    UP,
    DOWN,
    LEFT,
    RIGHT,
    VENDOR_1, // The 'PS Button' or 'Xbox Home' button.
    VENDOR_2, // The Dualshock4's touch panel thing.
    STICK_LEFT_UP,
    STICK_LEFT_DOWN,
    STICK_LEFT_LEFT,
    STICK_LEFT_RIGHT,
    STICK_RIGHT_UP,
    STICK_RIGHT_DOWN,
    STICK_RIGHT_LEFT,
    STICK_RIGHT_RIGHT,
}

export enum GamepadStick {
    LEFT,
    RIGHT,
}

export enum GamepadStickAxis {
    LEFT_X,
    LEFT_Y,
    RIGHT_X,
    RIGHT_Y,
}

export class GamepadInput implements InputInterface {
    private scene: Phaser.Scene;
    private pad: Gamepad;
    private button: GamepadButton;

    constructor(pad: Gamepad, button: GamepadButton) {
        this.scene = new PhaserGame().getPhaserScene();
        this.pad = pad;
        this.button = button;
    }

    public isActive(): number {
        // What gamepad?
        const gamepad = this.getGamepad(this.pad);

        // If there's no gamepad, the button is not pressed.
        if (gamepad === null) {
            return 0;
        }

        // Get the relevant button press and decide how much it's pressed.
        if (this.button === GamepadButton.L1) {
            return gamepad.L1;
        } else if (this.button === GamepadButton.R1) {
            return gamepad.R1;
        } else if (this.button === GamepadButton.L2) {
            return gamepad.L2;
        } else if (this.button === GamepadButton.R2) {
            return gamepad.R2;
        } else if (this.button === GamepadButton.STICK_LEFT_UP) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.LEFT);
            return (vec.y >= 0) ? 0 : Math.abs(vec.y);
        } else if (this.button === GamepadButton.STICK_LEFT_DOWN) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.LEFT);
            return (vec.y <= 0) ? 0 : Math.abs(vec.y);
        } else if (this.button === GamepadButton.STICK_LEFT_LEFT) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.LEFT);
            return (vec.x >= 0) ? 0 : Math.abs(vec.x);
        } else if (this.button === GamepadButton.STICK_LEFT_RIGHT) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.LEFT);
            return (vec.x <= 0) ? 0 : Math.abs(vec.x);
        } else if (this.button === GamepadButton.STICK_RIGHT_UP) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.RIGHT);
            return (vec.y >= 0) ? 0 : Math.abs(vec.y);
        } else if (this.button === GamepadButton.STICK_RIGHT_DOWN) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.RIGHT);
            return (vec.y <= 0) ? 0 : Math.abs(vec.y);
        } else if (this.button === GamepadButton.STICK_RIGHT_LEFT) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.RIGHT);
            return (vec.x >= 0) ? 0 : Math.abs(vec.x);
        } else if (this.button === GamepadButton.STICK_RIGHT_RIGHT) {
            const vec = this.getGamepadStickVector(this.pad, GamepadStick.RIGHT);
            return (vec.x <= 0) ? 0 : Math.abs(vec.x);
        } else {
            return (gamepad.isButtonDown(this.button)) ? 1 : 0;
        }
    }

    private getGamepadStickVector(pad: Gamepad, stick: GamepadStick): { x: number, y: number } {
        // Get gamepad.
        const gamepad = this.getGamepad(pad);

        // Default.
        const vector = {
            x: 0,
            y: 0,
        };

        // Get the current stick vector.
        if (gamepad !== undefined && stick === GamepadStick.LEFT) {
            vector.x = gamepad.getAxisValue(GamepadStickAxis.LEFT_X);
            vector.y = gamepad.getAxisValue(GamepadStickAxis.LEFT_Y);
        } else if (gamepad !== undefined && stick === GamepadStick.RIGHT) {
            vector.x = gamepad.getAxisValue(GamepadStickAxis.RIGHT_X);
            vector.y = gamepad.getAxisValue(GamepadStickAxis.RIGHT_Y);
        }

        // Return the values.
        return vector;
    }

    private getGamepad(pad: Gamepad): Phaser.Input.Gamepad.Gamepad {
        if (pad === Gamepad.ONE) {
            return this.scene.input.gamepad.pad1;
        } else if (pad === Gamepad.TWO) {
            return this.scene.input.gamepad.pad2;
        } else if (pad === Gamepad.THREE) {
            return this.scene.input.gamepad.pad3;
        } else if (pad === Gamepad.FOUR) {
            return this.scene.input.gamepad.pad4;
        }

        // Fallthrough return nothing.
        return null;
    }
}
