/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { AboutCardProps } from './components/AboutCard';
import { DefaultCatalogPageProps } from './components/CatalogPage';
import { DependencyOfComponentsCardProps } from './components/DependencyOfComponentsCard';
import { DependsOnComponentsCardProps } from './components/DependsOnComponentsCard';
import { DependsOnResourcesCardProps } from './components/DependsOnResourcesCard';
import { HasComponentsCardProps } from './components/HasComponentsCard';
import { HasResourcesCardProps } from './components/HasResourcesCard';
import { HasSubcomponentsCardProps } from './components/HasSubcomponentsCard';
import { HasSystemsCardProps } from './components/HasSystemsCard';
import { RelatedEntitiesCardProps } from './components/RelatedEntitiesCard';
/** @public */
export declare const catalogPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    catalogIndex: import("@backstage/core-plugin-api").RouteRef<undefined>;
    catalogEntity: import("@backstage/core-plugin-api").RouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }>;
}, {
    createComponent: import("@backstage/core-plugin-api").ExternalRouteRef<undefined, true>;
    viewTechDoc: import("@backstage/core-plugin-api").ExternalRouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }, true>;
}>;
/** @public */
export declare const CatalogIndexPage: (props: DefaultCatalogPageProps) => JSX.Element;
/** @public */
export declare const CatalogEntityPage: () => JSX.Element;
/** @public */
export declare const EntityAboutCard: (props: AboutCardProps) => JSX.Element;
/** @public */
export declare const EntityLinksCard: typeof import("./components/EntityLinksCard").EntityLinksCard;
/** @public */
export declare const EntityHasSystemsCard: (props: HasSystemsCardProps) => JSX.Element;
/** @public */
export declare const EntityHasComponentsCard: (props: HasComponentsCardProps) => JSX.Element;
/** @public */
export declare const EntityHasSubcomponentsCard: (props: HasSubcomponentsCardProps) => JSX.Element;
/** @public */
export declare const EntityHasResourcesCard: (props: HasResourcesCardProps) => JSX.Element;
/** @public */
export declare const EntityDependsOnComponentsCard: (props: DependsOnComponentsCardProps) => JSX.Element;
/** @public */
export declare const EntityDependencyOfComponentsCard: (props: DependencyOfComponentsCardProps) => JSX.Element;
/** @public */
export declare const EntityDependsOnResourcesCard: (props: DependsOnResourcesCardProps) => JSX.Element;
/** @public */
export declare const RelatedEntitiesCard: <T extends Entity>(props: RelatedEntitiesCardProps<T>) => JSX.Element;
