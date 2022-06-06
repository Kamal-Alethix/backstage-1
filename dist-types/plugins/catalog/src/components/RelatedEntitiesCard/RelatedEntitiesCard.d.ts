/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { InfoCardVariants, TableColumn } from '@backstage/core-components';
/** @public */
export declare type RelatedEntitiesCardProps<T extends Entity> = {
    variant?: InfoCardVariants;
    title: string;
    columns: TableColumn<T>[];
    entityKind?: string;
    relationType: string;
    emptyMessage: string;
    emptyHelpLink: string;
    asRenderableEntities: (entities: Entity[]) => T[];
};
/**
 * A low level card component that can be used as a building block for more
 * specific cards.
 *
 * @remarks
 *
 * You probably want to make a dedicated component for your needs, which renders
 * this card as its implementation with some of the props set to the appropriate
 * values.
 *
 * @public
 */
export declare function RelatedEntitiesCard<T extends Entity>(props: RelatedEntitiesCardProps<T>): JSX.Element;
