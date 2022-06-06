import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import React from 'react';
/**
 * Props for {@link EntityListComponent}.
 *
 * @public
 */
export interface EntityListComponentProps {
    locations: Array<{
        target: string;
        entities: (Entity | CompoundEntityRef)[];
    }>;
    locationListItemIcon: (target: string) => React.ReactElement;
    collapsed?: boolean;
    firstListItem?: React.ReactElement;
    onItemClick?: (target: string) => void;
    withLinks?: boolean;
}
/**
 * Shows a result list of entities.
 *
 * @public
 */
export declare const EntityListComponent: (props: EntityListComponentProps) => JSX.Element;
