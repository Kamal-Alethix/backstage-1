import { AlertApiForwarder, NoOpAnalyticsApi, ErrorAlerter, OAuthRequestManager, WebStorage, UrlPatternDiscovery } from '@backstage/core-app-api';
export declare const defaultApis: (import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").DiscoveryApi, UrlPatternDiscovery, {
    configApi: import("@backstage/config").Config;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").AlertApi, AlertApiForwarder, {}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").AnalyticsApi, NoOpAnalyticsApi, {}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").ErrorApi, ErrorAlerter, {
    alertApi: import("@backstage/core-plugin-api").AlertApi;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").StorageApi, WebStorage, {
    errorApi: import("@backstage/core-plugin-api").ErrorApi;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").OAuthRequestApi, OAuthRequestManager, {}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").OAuthApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi, import("@backstage/core-plugin-api").OAuthApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi, {
    discoveryApi: import("@backstage/core-plugin-api").DiscoveryApi;
    oauthRequestApi: import("@backstage/core-plugin-api").OAuthRequestApi;
    configApi: import("@backstage/config").Config;
}>)[];
