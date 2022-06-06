import { RepoUrlPickerState } from './types';
export declare function serializeRepoPickerUrl(data: RepoUrlPickerState): string | undefined;
export declare function parseRepoPickerUrl(url: string | undefined): RepoUrlPickerState;
