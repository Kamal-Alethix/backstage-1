/// <reference types="react" />
import { InfoCardVariants } from '@backstage/core-components';
export declare type Props = {
    branch?: string;
    dense?: boolean;
    limit?: number;
    variant?: InfoCardVariants;
};
export declare const RecentWorkflowRunsCard: ({ branch, dense, limit, variant, }: Props) => JSX.Element;
