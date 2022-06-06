/// <reference types="react" />
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
export declare type TemplateCardProps = {
    template: TemplateEntityV1beta3;
    deprecated?: boolean;
};
export declare const TemplateCard: ({ template, deprecated }: TemplateCardProps) => JSX.Element;
