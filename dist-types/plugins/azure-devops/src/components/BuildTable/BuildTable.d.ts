/// <reference types="react" />
import { BuildRun } from '@backstage/plugin-azure-devops-common';
export declare const getBuildResultComponent: (result: number | undefined) => JSX.Element;
export declare const getBuildStateComponent: (status: number | undefined, result: number | undefined) => JSX.Element;
declare type BuildTableProps = {
    items?: BuildRun[];
    loading: boolean;
    error?: Error;
};
export declare const BuildTable: ({ items, loading, error }: BuildTableProps) => JSX.Element;
export {};
