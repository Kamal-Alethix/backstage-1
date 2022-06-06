import { ApiRef, ApiHolder } from '@backstage/core-plugin-api';
/**
 * An ApiHolder that queries multiple other holders from for
 * an Api implementation, returning the first one encountered..
 */
export declare class ApiAggregator implements ApiHolder {
    private readonly holders;
    constructor(...holders: ApiHolder[]);
    get<T>(apiRef: ApiRef<T>): T | undefined;
}
