import { Config } from '@backstage/config';
/**
 * The configuration parameters for a multi-org GitHub processor.
 * @public
 */
export declare type GithubMultiOrgConfig = Array<{
    /**
     * The name of the GitHub org to process.
     */
    name: string;
    /**
     * The namespace of the group created for this org.
     */
    groupNamespace: string;
    /**
     * The namespace of the users created for this org. If not specified defaults to undefined.
     */
    userNamespace: string | undefined;
}>;
export declare function readGithubMultiOrgConfig(config: Config): GithubMultiOrgConfig;
