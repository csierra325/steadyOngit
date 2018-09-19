
// A simple base logging service.
// To make a custom logger, extends this class and 
// overwrite any applicable methods
export class LoggingService {
    constructor() {}

    log(...messages: any[]): void {
        console.log(...messages);
    }

    logError(error: any, preamble?: string): void {
        console.error(`ERROR: ${preamble || ''} ${error}`);
    }
}
