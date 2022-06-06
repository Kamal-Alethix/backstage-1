import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection } from '../../api';
export declare class ConfigLocationEntityProvider implements EntityProvider {
    private readonly config;
    constructor(config: Config);
    getProviderName(): string;
    connect(connection: EntityProviderConnection): Promise<void>;
    private getEntitiesFromConfig;
}
