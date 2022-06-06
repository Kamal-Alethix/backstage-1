import React from 'react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { TemplateGroupFilter } from './TemplateGroups';
export declare type TemplateListPageProps = {
    TemplateCardComponent?: React.ComponentType<{
        template: TemplateEntityV1beta3;
    }>;
    groups?: TemplateGroupFilter[];
};
export declare const TemplateListPage: (props: TemplateListPageProps) => JSX.Element;
