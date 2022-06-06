import React, { PropsWithChildren } from 'react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { TemplateGroupFilter } from '../TemplateListPage/TemplateGroups';
/**
 * The Props for the Scaffolder Router
 *
 * @alpha
 */
export declare type NextRouterProps = {
    components?: {
        TemplateCardComponent?: React.ComponentType<{
            template: TemplateEntityV1beta3;
        }>;
        TaskPageComponent?: React.ComponentType<{}>;
    };
    groups?: TemplateGroupFilter[];
};
/**
 * The Scaffolder Router
 *
 * @alpha
 */
export declare const Router: (props: PropsWithChildren<NextRouterProps>) => JSX.Element;
