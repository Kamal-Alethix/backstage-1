import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import React from 'react';
import { LinkProps } from '@backstage/core-components';
/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export declare type EntityRefLinkProps = {
    entityRef: Entity | CompoundEntityRef | string;
    defaultKind?: string;
    title?: string;
    children?: React.ReactNode;
} & Omit<LinkProps, 'to'>;
/**
 * Shows a clickable link to an entity.
 *
 * @public
 */
export declare const EntityRefLink: (props: EntityRefLinkProps) => JSX.Element;
