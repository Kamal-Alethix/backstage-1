import React from 'react';
import { ScaffolderTaskStatus } from '../../types';
declare type TaskStep = {
    id: string;
    name: string;
    status: ScaffolderTaskStatus;
    startedAt?: string;
    endedAt?: string;
};
export declare const TaskStatusStepper: React.MemoExoticComponent<(props: {
    steps: TaskStep[];
    currentStepId: string | undefined;
    onUserStepChange: (id: string) => void;
    classes?: {
        root?: string | undefined;
    } | undefined;
}) => JSX.Element>;
/**
 * TaskPageProps for constructing a TaskPage
 * @param loadingText - Optional loading text shown before a task begins executing.
 *
 * @public
 */
export declare type TaskPageProps = {
    loadingText?: string;
};
/**
 * TaskPage for showing the status of the taskId provided as a param
 * @param loadingText - Optional loading text shown before a task begins executing.
 *
 * @public
 */
export declare const TaskPage: ({ loadingText }: TaskPageProps) => JSX.Element;
export {};
