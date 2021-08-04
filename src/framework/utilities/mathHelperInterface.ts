export interface MathHelperInterface {
    /**
     * Convert a number in a range to a number between 0 and 1.
     *
     * @param val Target in range.
     * @param max Max value in range.
     * @param min Min value in range.
     */
    normalise(val: number, max: number, min: number): number;

    /**
     * Ensure a value is between a max and min.
     *
     * @param val Target in range.
     * @param max Max value in range.
     * @param min Min value in range.
     */
    clamp(val: number, min: number, max: number): number;

    /**
     * Get the angle of two points relative to the x axis.
     *
     * @param vector1
     * @param vector2
     */
    getAngle(vector1: Phaser.Math.Vector2, vector2: Phaser.Math.Vector2): number;

    /**
     * Get the velocity to move towards a point.
     *
     * @param rotation The angle, as returned by getAngle().
     * @param speed The speed.
     * @param vec2 The point.
     */
    velocityFromRotation(rotation: number, speed: number, vec2?: Phaser.Math.Vector2): Phaser.Math.Vector2;
}
