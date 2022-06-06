import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { ApiRef } from '@backstage/core-plugin-api';
/**
 * Factory class for creating {@link @backstage/integration#ScmIntegrationRegistry} instances.
 *
 * @public
 */
export declare class ScmIntegrationsApi {
    /**
     * Instantiates an {@link @backstage/integration#ScmIntegrationRegistry}.
     *
     * @param config - The root of the config hierarchy.
     */
    static fromConfig(config: Config): ScmIntegrationRegistry;
}
/**
 * The API that holds all configured SCM integrations.
 *
 * @public
 */
export declare const scmIntegrationsApiRef: ApiRef<ScmIntegrationRegistry>;
