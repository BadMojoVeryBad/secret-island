export interface PlayerStrategyInterface {
    /**
     * Get the player's x velocity.
     */
    getVelocityX(canMove: boolean): number;

    /**
     * Get the player's y velocity.
     *
     * @param currentVelocity
     * @param isGrounded Is the player currently touching the ground.
     * @param lastGrounded The game time of when the player was last touching the ground.
     * @param isJumping Is the player mid-jump.
     */
    getVelocityY(currentVelocity: Phaser.Math.Vector2, isGrounded: boolean, lastGrounded: number, isJumping: boolean, canMove: boolean): number;

    /**
     * Returns the name of the animation to use for whatever the player is currently doing.
     *
     * @param currentVelocity
     * @param isGrounded
     */
    getAnimation(currentVelocity: Phaser.Math.Vector2, isGrounded: boolean, isSitting: boolean): string;

    /**
     * Is the player doing electrified.
     */
    isActive(): boolean;
}
