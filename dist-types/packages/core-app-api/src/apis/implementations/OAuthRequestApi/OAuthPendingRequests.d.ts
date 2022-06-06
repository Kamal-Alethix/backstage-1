import { Observable } from '@backstage/types';
export declare type PendingRequest<ResultType> = {
    scopes: Set<string> | undefined;
    resolve: (value: ResultType) => void;
    reject: (reason: Error) => void;
};
export declare function hasScopes(searched: Set<string>, searchFor: Set<string>): boolean;
export declare function joinScopes(scopes: Set<string>, ...moreScopess: Set<string>[]): Set<string>;
/**
 * The OAuthPendingRequests class is a utility for managing and observing
 * a stream of requests for oauth scopes for a single provider, and resolving
 * them correctly once requests are fulfilled.
 */
export declare class OAuthPendingRequests<ResultType> {
    private requests;
    private subject;
    request(scopes: Set<string>): Promise<ResultType>;
    resolve(scopes: Set<string>, result: ResultType): void;
    reject(error: Error): void;
    pending(): Observable<PendingRequest<ResultType>>;
    private getCurrentPending;
}
