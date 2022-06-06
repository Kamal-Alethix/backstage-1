/// <reference types="react" />
import { V1Job } from '@kubernetes/client-node';
export declare const JobDrawer: ({ job, expanded, }: {
    job: V1Job;
    expanded?: boolean | undefined;
}) => JSX.Element;
