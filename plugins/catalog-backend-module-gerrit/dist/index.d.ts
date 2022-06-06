import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';

/** @public */
declare class GerritEntityProvider implements EntityProvider {
    private readonly config;
    private readonly integration;
    private readonly logger;
    private readonly scheduleFn;
    private connection?;
    static fromConfig(configRoot: Config, options: {
        logger: Logger;
        schedule: TaskRunner;
    }): GerritEntityProvider[];
    private constructor();
    getProviderName(): string;
    connect(connection: EntityProviderConnection): Promise<void>;
    private createScheduleFn;
    refresh(logger: Logger): Promise<void>;
    private createLocationSpec;
}

export { GerritEntityProvider };
