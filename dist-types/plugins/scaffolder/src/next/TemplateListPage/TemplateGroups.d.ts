import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
/**
 * @alpha
 */
export declare type TemplateGroupFilter = {
    title?: React.ReactNode;
    filter: (entity: Entity) => boolean;
};
export interface TemplateGroupsProps {
    groups: TemplateGroupFilter[];
    TemplateCardComponent?: React.ComponentType<{
        template: TemplateEntityV1beta3;
    }>;
}
export declare const TemplateGroups: (props: TemplateGroupsProps) => JSX.Element | null;
