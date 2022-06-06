/// <reference types="react" />
import { V1CronJob } from '@kubernetes/client-node';
export declare const CronJobDrawer: ({ cronJob, expanded, }: {
    cronJob: V1CronJob;
    expanded?: boolean | undefined;
}) => JSX.Element;
