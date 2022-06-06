import { AuthProviderInfo, DiscoveryApi } from '@backstage/core-plugin-api';
declare type Options = {
    discoveryApi: DiscoveryApi;
    environment?: string;
    provider: AuthProviderInfo;
};
export declare class DirectAuthConnector<DirectAuthResponse> {
    private readonly discoveryApi;
    private readonly environment;
    private readonly provider;
    constructor(options: Options);
    createSession(): Promise<DirectAuthResponse>;
    refreshSession(): Promise<any>;
    removeSession(): Promise<void>;
    private buildUrl;
}
export {};
