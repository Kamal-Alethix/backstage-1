import type { ApiRef } from './types';
/**
 * API reference configuration - holds an ID of the referenced API.
 *
 * @public
 */
export declare type ApiRefConfig = {
    id: string;
};
/**
 * Creates a reference to an API.
 *
 * @param config - The descriptor of the API to reference.
 * @returns An API reference.
 * @public
 */
export declare function createApiRef<T>(config: ApiRefConfig): ApiRef<T>;
