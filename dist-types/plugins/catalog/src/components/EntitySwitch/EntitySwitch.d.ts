import { Entity } from '@backstage/catalog-model';
import { ReactNode } from 'react';
import { ApiHolder } from '@backstage/core-plugin-api';
/** @public */
export interface EntitySwitchCaseProps {
    if?: (entity: Entity, context: {
        apis: ApiHolder;
    }) => boolean | Promise<boolean>;
    children: ReactNode;
}
/**
 * Props for the {@link EntitySwitch} component.
 * @public
 */
export interface EntitySwitchProps {
    children: ReactNode;
}
/** @public */
export declare const EntitySwitch: {
    (props: EntitySwitchProps): JSX.Element | null;
    Case: (_props: EntitySwitchCaseProps) => null;
};
