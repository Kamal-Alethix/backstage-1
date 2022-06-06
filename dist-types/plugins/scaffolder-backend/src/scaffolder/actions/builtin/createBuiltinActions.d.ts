import { UrlReader } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import { CatalogApi } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import { Config } from '@backstage/config';
import { TemplateFilter } from '../../../lib';
import { TemplateAction } from '../types';
/**
 * The options passed to {@link createBuiltinActions}
 * @public
 */
export interface CreateBuiltInActionsOptions {
    /**
     * The {@link @backstage/backend-common#UrlReader} interface that will be used in the default actions.
     */
    reader: UrlReader;
    /**
     * The {@link @backstage/integrations#ScmIntegrations} that will be used in the default actions.
     */
    integrations: ScmIntegrations;
    /**
     * The {@link @backstage/catalog-client#CatalogApi} that will be used in the default actions.
     */
    catalogClient: CatalogApi;
    /**
     * The {@link @backstage/config#Config} that will be used in the default actions.
     */
    config: Config;
    /**
     * Additional custom filters that will be passed to the nunjucks template engine for use in
     * Template Manifests and also template skeleton files when using `fetch:template`.
     */
    additionalTemplateFilters?: Record<string, TemplateFilter>;
}
/**
 * A function to generate create a list of default actions that the scaffolder provides.
 * Is called internally in the default setup, but can be used when adding your own actions or overriding the default ones
 *
 * @public
 * @returns A list of actions that can be used in the scaffolder
 */
export declare const createBuiltinActions: (options: CreateBuiltInActionsOptions) => TemplateAction<JsonObject>[];
