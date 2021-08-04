import { Container } from 'inversify';

/**
 * A thin wrpper around the inversify container so
 * we can access it in non-DI instances.
 */
export interface InversifyInterface {
    /**
     * Get the inversify container.
     *
     * @returns The inversify container.
     */
    getInversifyContainer(): Container;

    /**
     * Set the inversify container.
     *
     * @param container The inversify cotainer.
     */
    setInversifyContainer(container: Container): void;
}
