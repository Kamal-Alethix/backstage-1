/// <reference types="react" />
import { RepoUrlPickerState } from './types';
export declare const GerritRepoPicker: (props: {
    onChange: (state: RepoUrlPickerState) => void;
    state: RepoUrlPickerState;
    rawErrors: string[];
}) => JSX.Element;
