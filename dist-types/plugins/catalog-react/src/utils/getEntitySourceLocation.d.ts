import { Entity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
/** @public */
export declare type EntitySourceLocation = {
    locationTargetUrl: string;
    integrationType?: string;
};
/** @public */
export declare function getEntitySourceLocation(entity: Entity, scmIntegrationsApi: ScmIntegrationRegistry): EntitySourceLocation | undefined;
