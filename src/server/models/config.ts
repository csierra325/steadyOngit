import {LoggingService} from '../services/logger';

export interface Config {
    environment?: string;
    cookie_name?: string;
    cookie_secret?: string;
    port?: number;
    log_level?: string;
    logger?: LoggingService;
    client_root?: string;
}
