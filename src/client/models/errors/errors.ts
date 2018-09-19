export interface Error {
    message: string;
    timestamp: Date | string;
    context?: {[key: string]: any};
}

export interface HttpError extends Error {
    status: number;
    correlationId?: string;
}
