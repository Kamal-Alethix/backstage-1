/// <reference types="react" />
import { RepoUrlPickerState } from './types';
export declare const BitbucketRepoPicker: (props: {
    onChange: (state: RepoUrlPickerState) => void;
    state: RepoUrlPickerState;
    rawErrors: string[];
}) => JSX.Element;
