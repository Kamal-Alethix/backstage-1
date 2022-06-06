/** @public */
export interface AggregatedError {
    aggregation_key: string;
    total_count: number;
    severity: string;
    latest_errors: ErrorInstance[];
}
/** @public */
export interface ErrorInstance {
    error: Error;
    uuid: string;
    timestamp: number;
    severity: string;
    http_context: HttpContext;
}
/** @public */
export interface Error {
    class: string;
    message: string;
    stacktrace?: string[];
    cause?: Error | null;
}
/** @public */
export interface HttpContext {
    request_method: string;
    request_url: string;
    request_headers: RequestHeaders;
    request_body: string;
}
/** @public */
export interface RequestHeaders {
    [k: string]: string;
}
/** @public */
export interface NotFoundInInstance {
    body: string;
}
