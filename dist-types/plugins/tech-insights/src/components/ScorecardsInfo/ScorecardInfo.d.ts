/// <reference types="react" />
import { CheckResult } from '@backstage/plugin-tech-insights-common';
declare type Checks = {
    checks: CheckResult[];
    title?: string;
    description?: string;
};
export declare const ScorecardInfo: ({ checks, title, description }: Checks) => JSX.Element;
export {};
