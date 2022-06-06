/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/**
 * Props for {@link DocsCardGrid}
 *
 * @public
 */
export declare type DocsCardGridProps = {
    entities: Entity[] | undefined;
};
/**
 * Component which accepts a list of entities and renders a item card for each entity
 *
 * @public
 */
export declare const DocsCardGrid: (props: DocsCardGridProps) => JSX.Element | null;
