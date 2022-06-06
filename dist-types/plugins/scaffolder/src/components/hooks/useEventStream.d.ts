import { ScaffolderTask, ScaffolderTaskStatus, ScaffolderTaskOutput } from '../../types';
declare type Step = {
    id: string;
    status: ScaffolderTaskStatus;
    endedAt?: string;
    startedAt?: string;
};
export declare type TaskStream = {
    loading: boolean;
    error?: Error;
    stepLogs: {
        [stepId in string]: string[];
    };
    completed: boolean;
    task?: ScaffolderTask;
    steps: {
        [stepId in string]: Step;
    };
    output?: ScaffolderTaskOutput;
};
export declare const useTaskEventStream: (taskId: string) => TaskStream;
export {};
