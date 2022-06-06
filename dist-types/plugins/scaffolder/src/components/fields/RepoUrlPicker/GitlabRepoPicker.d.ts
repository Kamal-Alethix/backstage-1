/// <reference types="react" />
import { RepoUrlPickerState } from './types';
export declare const GitlabRepoPicker: (props: {
    allowedOwners?: string[] | undefined;
    state: RepoUrlPickerState;
    onChange: (state: RepoUrlPickerState) => void;
    rawErrors: string[];
}) => JSX.Element;
