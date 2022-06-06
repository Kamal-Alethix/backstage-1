/// <reference types="react" />
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { LinkProps } from '@backstage/core-components';
/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export declare type EntityRefLinksProps = {
    entityRefs: (string | Entity | CompoundEntityRef)[];
    defaultKind?: string;
} & Omit<LinkProps, 'to'>;
/**
 * Shows a list of clickable links to entities.
 *
 * @public
 */
export declare function EntityRefLinks(props: EntityRefLinksProps): JSX.Element;
