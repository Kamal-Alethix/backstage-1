import type { JsonObject } from '@backstage/types';
export declare type FormatClusterLinkOptions = {
    dashboardUrl?: string;
    dashboardApp?: string;
    dashboardParameters?: JsonObject;
    object: any;
    kind: string;
};
export declare function formatClusterLink(options: FormatClusterLinkOptions): string | undefined;
