import { ApiEntity } from '@backstage/catalog-model';
import { ApiDefinitionWidget } from './components/ApiDefinitionCard/ApiDefinitionWidget';
export declare const apiDocsConfigRef: import("@backstage/core-plugin-api").ApiRef<ApiDocsConfig>;
export interface ApiDocsConfig {
    getApiDefinitionWidget: (apiEntity: ApiEntity) => ApiDefinitionWidget | undefined;
}
