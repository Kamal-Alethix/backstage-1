export interface AggregatedError {
    aggregation_key: string;
    total_count: number;
    severity: string;
    latest_errors: ErrorInstance[];
}
export interface ErrorInstance {
    error: Error;
    uuid: string;
    timestamp: number;
    severity: string;
    http_context: HttpContext;
}
export interface Error {
    class: string;
    message: string;
    stacktrace?: string[];
    cause?: Error | null;
}
export interface HttpContext {
    request_method: string;
    request_url: string;
    request_headers: RequestHeaders;
    request_body: string;
}
export interface RequestHeaders {
    [k: string]: string;
}
export interface NotFoundInInstance {
    body: string;
}
