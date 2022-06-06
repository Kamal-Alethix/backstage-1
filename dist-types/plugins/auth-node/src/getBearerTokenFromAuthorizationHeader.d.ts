/**
 * Parses the given authorization header and returns the bearer token, or
 * undefined if no bearer token is given.
 *
 * @remarks
 *
 * This function is explicitly built to tolerate bad inputs safely, so you may
 * call it directly with e.g. the output of `req.header('authorization')`
 * without first checking that it exists.
 *
 * @public
 */
export declare function getBearerTokenFromAuthorizationHeader(authorizationHeader: unknown): string | undefined;
