/// <reference types="react" />
import * as _backstage_core_components from '@backstage/core-components';
import { TableColumn, TableProps, InfoCardVariants } from '@backstage/core-components';
import { CatalogTableRow } from '@backstage/plugin-catalog';
import { UserListFilterKind } from '@backstage/plugin-catalog-react';
import React from 'react';
import { ApiEntity } from '@backstage/catalog-model';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

/**
 * DefaultApiExplorerPageProps
 * @public
 */
declare type DefaultApiExplorerPageProps = {
    initiallySelectedFilter?: UserListFilterKind;
    columns?: TableColumn<CatalogTableRow>[];
    actions?: TableProps<CatalogTableRow>['actions'];
};
/**
 * DefaultApiExplorerPage
 * @public
 */
declare const DefaultApiExplorerPage: ({ initiallySelectedFilter, columns, actions, }: DefaultApiExplorerPageProps) => JSX.Element;

/**
 * ApiExplorerPage
 * @public
 */
declare const ApiExplorerPage$1: (props: DefaultApiExplorerPageProps) => JSX.Element;

declare const ApiDefinitionCard: () => JSX.Element;

declare type ApiDefinitionWidget = {
    type: string;
    title: string;
    component: (definition: string) => React.ReactElement;
    rawLanguage?: string;
};
declare function defaultDefinitionWidgets(): ApiDefinitionWidget[];

declare const ApiTypeTitle: ({ apiEntity }: {
    apiEntity: ApiEntity;
}) => JSX.Element;

declare type Props$4 = {
    variant?: InfoCardVariants;
};
declare const ConsumedApisCard: ({ variant }: Props$4) => JSX.Element;

declare type Props$3 = {
    variant?: InfoCardVariants;
};
declare const HasApisCard: ({ variant }: Props$3) => JSX.Element;

declare type Props$2 = {
    variant?: InfoCardVariants;
};
declare const ProvidedApisCard: ({ variant }: Props$2) => JSX.Element;

declare type AsyncApiDefinitionWidgetProps = {
    definition: string;
};
declare const AsyncApiDefinitionWidget: (props: AsyncApiDefinitionWidgetProps) => JSX.Element;

declare type Props$1 = {
    variant?: InfoCardVariants;
};
declare const ConsumingComponentsCard: ({ variant }: Props$1) => JSX.Element;

declare type Props = {
    variant?: InfoCardVariants;
};
declare const ProvidingComponentsCard: ({ variant }: Props) => JSX.Element;

declare type GraphQlDefinitionWidgetProps = {
    definition: string;
};
declare const GraphQlDefinitionWidget: (props: GraphQlDefinitionWidgetProps) => JSX.Element;

declare type OpenApiDefinitionWidgetProps = {
    definition: string;
};
declare const OpenApiDefinitionWidget: (props: OpenApiDefinitionWidgetProps) => JSX.Element;

declare type PlainApiDefinitionWidgetProps = {
    definition: any;
    language: string;
};
declare const PlainApiDefinitionWidget: (props: PlainApiDefinitionWidgetProps) => JSX.Element;

declare const apiDocsConfigRef: _backstage_core_plugin_api.ApiRef<ApiDocsConfig>;
interface ApiDocsConfig {
    getApiDefinitionWidget: (apiEntity: ApiEntity) => ApiDefinitionWidget | undefined;
}

declare const apiDocsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {
    registerApi: _backstage_core_plugin_api.ExternalRouteRef<undefined, true>;
}>;
declare const ApiExplorerPage: (props: DefaultApiExplorerPageProps) => JSX.Element;
declare const EntityApiDefinitionCard: () => JSX.Element;
declare const EntityConsumedApisCard: ({ variant }: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;
declare const EntityConsumingComponentsCard: ({ variant }: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;
declare const EntityProvidedApisCard: ({ variant }: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;
declare const EntityProvidingComponentsCard: ({ variant }: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;
declare const EntityHasApisCard: ({ variant }: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;

export { ApiDefinitionCard, ApiDefinitionWidget, ApiExplorerPage$1 as ApiExplorerIndexPage, ApiExplorerPage, ApiTypeTitle, AsyncApiDefinitionWidget, AsyncApiDefinitionWidgetProps, ConsumedApisCard, ConsumingComponentsCard, DefaultApiExplorerPage, DefaultApiExplorerPageProps, EntityApiDefinitionCard, EntityConsumedApisCard, EntityConsumingComponentsCard, EntityHasApisCard, EntityProvidedApisCard, EntityProvidingComponentsCard, GraphQlDefinitionWidget, GraphQlDefinitionWidgetProps, HasApisCard, OpenApiDefinitionWidget, OpenApiDefinitionWidgetProps, PlainApiDefinitionWidget, PlainApiDefinitionWidgetProps, ProvidedApisCard, ProvidingComponentsCard, apiDocsConfigRef, apiDocsPlugin, defaultDefinitionWidgets, apiDocsPlugin as plugin };
