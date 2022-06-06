import React from 'react';
import { V1Job } from '@kubernetes/client-node';
declare type JobsAccordionsProps = {
    jobs: V1Job[];
    children?: React.ReactNode;
};
export declare const JobsAccordions: ({ jobs }: JobsAccordionsProps) => JSX.Element;
export {};
