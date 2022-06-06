import { AlertApiForwarder, NoOpAnalyticsApi, ErrorAlerter, OAuthRequestManager, WebStorage, UrlPatternDiscovery } from '@backstage/core-app-api';
import { IdentityPermissionApi } from '@backstage/plugin-permission-react';
export declare const apis: (import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").DiscoveryApi, UrlPatternDiscovery, {
    configApi: import("@backstage/config").Config;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").AlertApi, AlertApiForwarder, {
    [x: string]: unknown;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").AnalyticsApi, NoOpAnalyticsApi, {
    [x: string]: unknown;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").ErrorApi, ErrorAlerter, {
    alertApi: import("@backstage/core-plugin-api").AlertApi;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").StorageApi, WebStorage, {
    errorApi: import("@backstage/core-plugin-api").ErrorApi;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").FetchApi, import("@backstage/core-plugin-api").FetchApi, {
    configApi: import("@backstage/config").Config;
    identityApi: import("@backstage/core-plugin-api").IdentityApi;
    discoveryApi: import("@backstage/core-plugin-api").DiscoveryApi;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").OAuthRequestApi, OAuthRequestManager, {
    [x: string]: unknown;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/core-plugin-api").OAuthApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi, import("@backstage/core-plugin-api").OAuthApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi, {
    discoveryApi: import("@backstage/core-plugin-api").DiscoveryApi;
    oauthRequestApi: import("@backstage/core-plugin-api").OAuthRequestApi;
    configApi: import("@backstage/config").Config;
}> | import("@backstage/core-plugin-api").ApiFactory<import("@backstage/plugin-permission-react").PermissionApi, IdentityPermissionApi, {
    discovery: import("@backstage/core-plugin-api").DiscoveryApi;
    identity: import("@backstage/core-plugin-api").IdentityApi;
    config: import("@backstage/config").Config;
}>)[];
