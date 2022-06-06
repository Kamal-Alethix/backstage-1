import { ApiRef } from '../system';
/**
 * A wrapper for the fetch API, that has additional behaviors such as the
 * ability to automatically inject auth information where necessary.
 *
 * @public
 */
export declare type FetchApi = {
    /**
     * The `fetch` implementation.
     */
    fetch: typeof fetch;
};
/**
 * The {@link ApiRef} of {@link FetchApi}.
 *
 * @remarks
 *
 * This is a wrapper for the fetch API, that has additional behaviors such as
 * the ability to automatically inject auth information where necessary.
 *
 * @public
 */
export declare const fetchApiRef: ApiRef<FetchApi>;
