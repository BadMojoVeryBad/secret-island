import { Container, injectable } from 'inversify';
import { InversifyInterface } from './inversifyInterface';

/**
 * A thin wrpper around the inversify container so
 * we can access it in non-DI instances.
 */
@injectable()
export class Inversify implements InversifyInterface {
    private static container;

    public getInversifyContainer(): Container {
        return Inversify.container;
    }

    public setInversifyContainer(container: Container): void {
        Inversify.container = container;
    }
}
