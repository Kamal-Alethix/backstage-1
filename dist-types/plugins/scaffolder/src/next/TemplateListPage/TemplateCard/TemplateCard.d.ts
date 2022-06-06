/// <reference types="react" />
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
/**
 * The Props for the Template Card component
 * @alpha
 */
export interface TemplateCardProps {
    template: TemplateEntityV1beta3;
    deprecated?: boolean;
}
/**
 * The Template Card component that is rendered in a list for each template
 * @alpha
 */
export declare const TemplateCard: (props: TemplateCardProps) => JSX.Element;
