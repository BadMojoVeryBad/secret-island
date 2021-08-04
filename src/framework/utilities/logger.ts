import { LoggerInterface } from './loggerInterface';
import jsLogger, { ILogger as IJSLogger } from 'js-logger';
import { inject, injectable } from 'inversify';
import { PhaserGameInterface } from './phaserGameInterface';

@injectable()
export class Logger implements LoggerInterface {
    private logger: IJSLogger;
    private phaserGame: PhaserGameInterface;

    constructor(@inject('PhaserGameInterface') phaserGame: PhaserGameInterface) {
        this.phaserGame = phaserGame;
        jsLogger.useDefaults();

        jsLogger.setHandler((messages, context) => {
            // Log each message as a seperate line.
            for (const message of messages) {
                const time = this.formatGameTime();
                const str = '[' + time + '] - ' + message;

                if (context.level.value <= 3) {
                    // console.log(str);
                } else if (context.level.value <= 5) {
                    // console.warn(str);
                } else {
                    // console.error(str);
                }
            }
        });
        this.logger = jsLogger.get('GameLogger');
    }

    public debug(...x: string[]): void {
        this.logger.debug(x);
    }

    public info(...x: string[]): void {
        this.logger.info(x);
    }

    public warn(...x: string[]): void {
        this.logger.warn(x);
    }

    public error(...x: string[]): void {
        this.logger.error(x);
    }

    public trace(...x: string[]): void {
        this.logger.trace(x);
    }

    private formatGameTime(): string {
        const millis = this.phaserGame.getTime();
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000);
        const time = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        return time;
    }
}
