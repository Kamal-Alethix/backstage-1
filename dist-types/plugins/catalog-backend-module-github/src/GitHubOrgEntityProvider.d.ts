import { TaskRunner } from '@backstage/backend-tasks';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { GithubCredentialsProvider, GitHubIntegrationConfig } from '@backstage/integration';
import { EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * Options for {@link GitHubOrgEntityProvider}.
 *
 * @public
 */
export interface GitHubOrgEntityProviderOptions {
    /**
     * A unique, stable identifier for this provider.
     *
     * @example "production"
     */
    id: string;
    /**
     * The target that this provider should consume.
     *
     * @example "https://github.com/backstage"
     */
    orgUrl: string;
    /**
     * The refresh schedule to use.
     *
     * @defaultValue "manual"
     * @remarks
     *
     * If you pass in 'manual', you are responsible for calling the `read` method
     * manually at some interval.
     *
     * But more commonly you will pass in the result of
     * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
     * to enable automatic scheduling of tasks.
     */
    schedule?: 'manual' | TaskRunner;
    /**
     * The logger to use.
     */
    logger: Logger;
    /**
     * Optionally supply a custom credentials provider, replacing the default one.
     */
    githubCredentialsProvider?: GithubCredentialsProvider;
}
/**
 * Ingests org data (users and groups) from GitHub.
 *
 * @public
 */
export declare class GitHubOrgEntityProvider implements EntityProvider {
    private options;
    private readonly credentialsProvider;
    private connection?;
    private scheduleFn?;
    static fromConfig(config: Config, options: GitHubOrgEntityProviderOptions): GitHubOrgEntityProvider;
    constructor(options: {
        id: string;
        orgUrl: string;
        gitHubConfig: GitHubIntegrationConfig;
        logger: Logger;
        githubCredentialsProvider?: GithubCredentialsProvider;
    });
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
    getProviderName(): string;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
    connect(connection: EntityProviderConnection): Promise<void>;
    /**
     * Runs one single complete ingestion. This is only necessary if you use
     * manual scheduling.
     */
    read(options?: {
        logger?: Logger;
    }): Promise<void>;
    private schedule;
}
export declare function withLocations(baseUrl: string, org: string, entity: Entity): Entity;
