import { injectable } from 'inversify';

@injectable()
export class MathHelper {
    /**
     * @inheritdoc
     */
    public normalise(val: number, max: number, min: number): number {
        return (val - min) / (max - min);
    }

    /**
     * @inheritdoc
     */
    public clamp(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }

    /**
     * @inheritdoc
     */
    public getAngle(vector1: Phaser.Math.Vector2, vector2: Phaser.Math.Vector2): number {
        return Math.atan2(vector1.y - vector2.y, vector1.x - vector2.x);
    }

    /**
     * @inheritdoc
     */
    public velocityFromRotation(rotation: number, speed: number, vec2: Phaser.Math.Vector2 = undefined): Phaser.Math.Vector2 {
        if (speed === undefined) { speed = 60; }
        if (vec2 === undefined) { vec2 = new Phaser.Math.Vector2(); }

        return vec2.setToPolar(rotation, speed);
    }
}
