/**
 * A middleware that modifies the behavior of an ongoing fetch.
 *
 * @public
 */
export interface FetchMiddleware {
    /**
     * Applies this middleware to an inner implementation.
     *
     * @param next - The next, inner, implementation, that this middleware shall
     *               call out to as part of the request cycle.
     */
    apply(next: typeof fetch): typeof fetch;
}
