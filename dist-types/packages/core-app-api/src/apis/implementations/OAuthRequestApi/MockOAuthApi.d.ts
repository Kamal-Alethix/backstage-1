import { OAuthRequestApi, OAuthRequesterOptions } from '@backstage/core-plugin-api';
export default class MockOAuthApi implements OAuthRequestApi {
    private readonly real;
    createAuthRequester<T>(options: OAuthRequesterOptions<T>): import("@backstage/core-plugin-api").OAuthRequester<T>;
    authRequest$(): import("@backstage/types").Observable<import("@backstage/core-plugin-api").PendingOAuthRequest[]>;
    triggerAll(): Promise<void>;
    rejectAll(): Promise<void>;
}
