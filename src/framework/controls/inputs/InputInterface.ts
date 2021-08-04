/**
 * Inputs used by the controlsInterface must implement this interface.
 */
export interface InputInterface {
    /**
     * Return a number representing how much an input is 'active'. Typically,
     * this will be a `0` if the input is not pressed, and a `1` if it is. Some
     * buttons can be pressed a certain amount (e.g. halfway pressed). These
     * buttons will have a number ranging from 0 to 1.
     */
    isActive(): number;
}
