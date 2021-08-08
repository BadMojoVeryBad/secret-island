import { inject, injectable } from 'inversify';
import { Control } from '../../framework/controls/Control';
import { ControlsInterface } from '../../framework/controls/ControlsInterface';
import { KeyboardInput } from '../../framework/controls/inputs/KeyboardInput';
import { EventsInterface } from '../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../framework/utilities/loggerInterface';
import { PhaserGameInterface } from '../../framework/utilities/phaserGameInterface';
import { Constants } from '../utilities/constants';
import { PlayerStrategyInterface } from './playerStrategyInterface';

@injectable()
export class PlayerStrategy implements PlayerStrategyInterface {
    private controls: ControlsInterface;
    private constants: Constants;
    private phaserGame: PhaserGameInterface;
    private logger: LoggerInterface;
    private events: EventsInterface;

    constructor(@inject('ControlsInterface') controls: ControlsInterface, @inject('Constants') constants: Constants, @inject('PhaserGameInterface') phaserGame: PhaserGameInterface, @inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface) {
        this.constants = constants;
        this.phaserGame = phaserGame;
        this.controls = controls;
        this.logger = logger;
        this.events = events;
        this.controls.registerInputs(Control.RIGHT, [ new KeyboardInput(39), new KeyboardInput(68) ]);
        this.controls.registerInputs(Control.LEFT, [ new KeyboardInput(37), new KeyboardInput(65) ]);
        this.controls.registerInputs(Control.JUMP, [ new KeyboardInput(38), new KeyboardInput(87), new KeyboardInput(32) ]);
        this.controls.registerInputs(Control.ACTIVATE, [ new KeyboardInput(90) ]);
    }

    /**
     * @inheritdoc
     */
    public getVelocityX(canMove: boolean): number {
        let velocity: number = null;

        // Handle left and right.
        if (this.controls.isActive(Control.LEFT) && canMove) {
            this.events.fire('robotMovingLeft');
            velocity = this.constants.PLAYER_HORIZONAL_VELOCITY * this.constants.NEGATIVE_ONE;
        } else if (this.controls.isActive(Control.RIGHT) && canMove) {
            this.events.fire('robotMovingRight');
            velocity = this.constants.PLAYER_HORIZONAL_VELOCITY;
        } else {
            this.events.fire('robotNotMoving');
            velocity = this.constants.ZERO;
        }

        return velocity;
    }

    /**
     * @inheritdoc
     */
    public getVelocityY(currentVelocity: Phaser.Math.Vector2, isGrounded: boolean, lastGrounded: number, isJumping: boolean, canMove: boolean): number {
        let velocity = null;

        // Jump even if the player has recently left a platform.
        const canJump = lastGrounded + this.constants.PLAYER_JUMP_DELAY > this.phaserGame.getTime();

        // Handle jump.
        if (this.controls.isActive(Control.JUMP) && canJump && !isJumping && canMove) {
            this.logger.info('Jumping.');
            this.events.fire('robotJumping');
            velocity = this.constants.PLAYER_VERTICAL_VELOCITY * this.constants.NEGATIVE_ONE;
        }

        // Modify the fall speed of the player. This makes the player seem less 'float-ey'.
        if (!isGrounded) {
            velocity = (velocity !== null) ? velocity : currentVelocity.y;
            velocity = velocity + (this.constants.PLAYER_GRAVITY_MODIFIER * this.phaserGame.getDelta());
        }

        return velocity;
    }

    /**
     * @inheritdoc
     */
    public getAnimation(currentVelocity: Phaser.Math.Vector2, isGrounded: boolean, isSitting: boolean): string {
        // Find animation.
        if (isSitting) {
            return 'playerSitting';
        } else if (currentVelocity.x !== 0 && isGrounded) {
            return 'playerRunning';
        } else if (!isGrounded && currentVelocity.y < 0) {
            return 'playerJumping';
        } else if (!isGrounded && currentVelocity.y >= 0) {
            return 'playerFalling';
        } else {
            return 'playerIdle';
        }
    }

    /**
     * @inheritdoc
     */
    public isActive(): boolean {
        return this.controls.isActive(Control.ACTIVATE) > 0;
    }
}
