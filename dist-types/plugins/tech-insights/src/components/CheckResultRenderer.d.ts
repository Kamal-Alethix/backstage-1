import { CheckResult } from '@backstage/plugin-tech-insights-common';
import React from 'react';
/**
 * Defines a react component that is responsible for rendering a results of a given type.
 *
 * @public
 */
export declare type CheckResultRenderer = {
    type: string;
    title: string;
    description: string;
    component: React.ReactElement;
};
export declare function defaultCheckResultRenderers(value: CheckResult[], title?: string, description?: string): CheckResultRenderer[];
