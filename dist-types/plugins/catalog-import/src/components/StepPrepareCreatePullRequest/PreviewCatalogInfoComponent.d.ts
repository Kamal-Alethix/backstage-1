/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/**
 * Props for {@link PreviewCatalogInfoComponent}.
 *
 * @public
 */
export interface PreviewCatalogInfoComponentProps {
    repositoryUrl: string;
    entities: Entity[];
    classes?: {
        card?: string;
        cardContent?: string;
    };
}
/**
 * Previews information about an entity to create.
 *
 * @public
 */
export declare const PreviewCatalogInfoComponent: (props: PreviewCatalogInfoComponentProps) => JSX.Element;
