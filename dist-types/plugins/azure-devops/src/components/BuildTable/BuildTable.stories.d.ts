/// <reference types="react" />
import { BuildRun } from '@backstage/plugin-azure-devops-common';
declare const _default: {
    title: string;
    component: ({ items, loading, error }: {
        items?: BuildRun[] | undefined;
        loading: boolean;
        error?: Error | undefined;
    }) => JSX.Element;
};
export default _default;
export declare const Default: () => JSX.Element;
export declare const Empty: () => JSX.Element;
export declare const Loading: () => JSX.Element;
export declare const ErrorMessage: () => JSX.Element;
