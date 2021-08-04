import { EventEmitter } from '@billjs/event-emitter';

/**
 * Wrapper around an ement emitter library for TypeScript I found
 * on GitHub.
 *
 * See here for docs: https://github.com/billjs/event-emitter
 */
export interface EventsInterface {
    fire(event: string, ...args: unknown[]): void;

    on(event: string, fn: (data: unknown) => void): void;

    once(event: string, fn: (data: unknown) => void): void;

    get(): EventEmitter;
}
