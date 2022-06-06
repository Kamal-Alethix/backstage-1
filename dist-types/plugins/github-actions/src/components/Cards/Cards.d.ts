/// <reference types="react" />
import { InfoCardVariants } from '@backstage/core-components';
export declare const LatestWorkflowRunCard: ({ branch, variant, }: Props) => JSX.Element;
declare type Props = {
    branch: string;
    variant?: InfoCardVariants;
};
export declare const LatestWorkflowsForBranchCard: ({ branch, variant, }: Props) => JSX.Element;
export {};
