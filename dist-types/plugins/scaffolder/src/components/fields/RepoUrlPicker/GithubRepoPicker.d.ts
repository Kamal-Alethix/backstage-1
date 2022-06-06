/// <reference types="react" />
import { RepoUrlPickerState } from './types';
export declare const GithubRepoPicker: (props: {
    allowedOwners?: string[] | undefined;
    rawErrors: string[];
    state: RepoUrlPickerState;
    onChange: (state: RepoUrlPickerState) => void;
}) => JSX.Element;
