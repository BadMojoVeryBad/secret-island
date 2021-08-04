import { EventEmitter, Event } from '@billjs/event-emitter';
import { injectable } from 'inversify';

/**
 * Wrapper around an ement emitter library for TypeScript I found
 * on GitHub.
 *
 * See here for docs: https://github.com/billjs/event-emitter
 */
@injectable()
export class Events {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
    }

    public fire(event: string, ...args: unknown[]): void {
        this.emitter.fire(event, args);
    }

    public on(event: string, fn: (data: unknown) => void): void {
        this.emitter.on(event, (ev: Event) => {
            fn((ev.data.length === 1) ? ev.data[0] : ev.data);
        });
    }

    public once(event: string, fn: (data: unknown) => void): void {
        this.emitter.on(event, (ev: Event) => {
            fn((ev.data.length === 1) ? ev.data[0] : ev.data);
        });
    }

    public get(): EventEmitter {
        return this.emitter;
    }
}
