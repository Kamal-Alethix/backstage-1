import { TaskRunner } from '@backstage/backend-tasks';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { GroupTransformer, MicrosoftGraphProviderConfig, OrganizationTransformer, UserTransformer } from '../microsoftGraph';
/**
 * Options for {@link MicrosoftGraphOrgEntityProvider}.
 *
 * @public
 */
export interface MicrosoftGraphOrgEntityProviderOptions {
    /**
     * A unique, stable identifier for this provider.
     *
     * @example "production"
     */
    id: string;
    /**
     * The target that this provider should consume.
     *
     * Should exactly match the "target" field of one of the providers
     * configuration entries.
     */
    target: string;
    /**
     * The logger to use.
     */
    logger: Logger;
    /**
     * The refresh schedule to use.
     *
     * @remarks
     *
     * If you pass in 'manual', you are responsible for calling the `read` method
     * manually at some interval.
     *
     * But more commonly you will pass in the result of
     * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
     * to enable automatic scheduling of tasks.
     */
    schedule: 'manual' | TaskRunner;
    /**
     * The function that transforms a user entry in msgraph to an entity.
     */
    userTransformer?: UserTransformer;
    /**
     * The function that transforms a group entry in msgraph to an entity.
     */
    groupTransformer?: GroupTransformer;
    /**
     * The function that transforms an organization entry in msgraph to an entity.
     */
    organizationTransformer?: OrganizationTransformer;
}
/**
 * Reads user and group entries out of Microsoft Graph, and provides them as
 * User and Group entities for the catalog.
 *
 * @public
 */
export declare class MicrosoftGraphOrgEntityProvider implements EntityProvider {
    private options;
    private connection?;
    private scheduleFn?;
    static fromConfig(configRoot: Config, options: MicrosoftGraphOrgEntityProviderOptions): MicrosoftGraphOrgEntityProvider;
    constructor(options: {
        id: string;
        provider: MicrosoftGraphProviderConfig;
        logger: Logger;
        userTransformer?: UserTransformer;
        groupTransformer?: GroupTransformer;
        organizationTransformer?: OrganizationTransformer;
    });
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
    getProviderName(): string;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
    connect(connection: EntityProviderConnection): Promise<void>;
    /**
     * Runs one complete ingestion loop. Call this method regularly at some
     * appropriate cadence.
     */
    read(options?: {
        logger?: Logger;
    }): Promise<void>;
    private schedule;
}
export declare function withLocations(providerId: string, entity: Entity): Entity;
