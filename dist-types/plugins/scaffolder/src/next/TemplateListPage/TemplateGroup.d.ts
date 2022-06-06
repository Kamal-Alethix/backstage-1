import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import React from 'react';
import { TemplateCardProps } from './TemplateCard';
export interface TemplateGroupProps {
    templates: TemplateEntityV1beta3[];
    title: React.ReactNode;
    components?: {
        CardComponent?: React.ComponentType<TemplateCardProps>;
    };
}
export declare const TemplateGroup: (props: TemplateGroupProps) => JSX.Element;
