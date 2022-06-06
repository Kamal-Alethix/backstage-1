import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { GroupTransformer, LdapProviderConfig, UserTransformer } from '../ldap';
/**
 * Options for {@link LdapOrgEntityProvider}.
 *
 * @public
 */
export interface LdapOrgEntityProviderOptions {
    /**
     * A unique, stable identifier for this provider.
     *
     * @example "production"
     */
    id: string;
    /**
     * The target that this provider should consume.
     *
     * Should exactly match the "target" field of one of the "ldap.providers"
     * configuration entries.
     *
     * @example "ldaps://ds-read.example.net"
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
     * The function that transforms a user entry in LDAP to an entity.
     */
    userTransformer?: UserTransformer;
    /**
     * The function that transforms a group entry in LDAP to an entity.
     */
    groupTransformer?: GroupTransformer;
}
/**
 * Reads user and group entries out of an LDAP service, and provides them as
 * User and Group entities for the catalog.
 *
 * @remarks
 *
 * Add an instance of this class to your catalog builder, and then periodically
 * call the {@link LdapOrgEntityProvider.read} method.
 *
 * @public
 */
export declare class LdapOrgEntityProvider implements EntityProvider {
    private options;
    private connection?;
    private scheduleFn?;
    static fromConfig(configRoot: Config, options: LdapOrgEntityProviderOptions): LdapOrgEntityProvider;
    constructor(options: {
        id: string;
        provider: LdapProviderConfig;
        logger: Logger;
        userTransformer?: UserTransformer;
        groupTransformer?: GroupTransformer;
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
