/// <reference types="react" />
import { BuildStepAction } from 'circleci-api';
export declare const ActionOutput: ({ url, name, className, action, }: {
    url: string;
    name: string;
    className?: string | undefined;
    action: BuildStepAction;
}) => JSX.Element;
