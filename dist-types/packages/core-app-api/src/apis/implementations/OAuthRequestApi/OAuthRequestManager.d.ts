import { OAuthRequestApi, PendingOAuthRequest, OAuthRequester, OAuthRequesterOptions } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
/**
 * The OAuthRequestManager is an implementation of the OAuthRequestApi.
 *
 * The purpose of this class and the API is to read a stream of incoming requests
 * of OAuth access tokens from different providers with varying scope, and funnel
 * them all together into a single request for each OAuth provider.
 *
 * @public
 */
export declare class OAuthRequestManager implements OAuthRequestApi {
    private readonly subject;
    private currentRequests;
    private handlerCount;
    createAuthRequester<T>(options: OAuthRequesterOptions<T>): OAuthRequester<T>;
    private makeAuthRequest;
    authRequest$(): Observable<PendingOAuthRequest[]>;
}
