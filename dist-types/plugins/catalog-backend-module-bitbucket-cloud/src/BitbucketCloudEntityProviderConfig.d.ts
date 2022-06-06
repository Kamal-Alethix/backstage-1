import { Config } from '@backstage/config';
export declare type BitbucketCloudEntityProviderConfig = {
    id: string;
    catalogPath: string;
    workspace: string;
    filters?: {
        projectKey?: RegExp;
        repoSlug?: RegExp;
    };
};
export declare function readProviderConfigs(config: Config): BitbucketCloudEntityProviderConfig[];
