export interface LoggerInterface {
    debug(...x: string[]): void;
    info(...x: string[]): void;
    warn(...x: string[]): void;
    error(...x: string[]): void;
    trace(...x: string[]): void;
}
