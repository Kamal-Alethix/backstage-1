/// <reference types="react" />
import { UseCreateReleaseCandidate } from '../features/CreateReleaseCandidate/hooks/useCreateReleaseCandidate';
import { UsePatch } from '../features/Patch/hooks/usePatch';
import { UsePromoteRc } from '../features/PromoteRc/hooks/usePromoteRc';
export declare type ComponentConfig<OnSuccessArgs> = {
    omit?: boolean;
    onSuccess?: (args: OnSuccessArgs) => Promise<void> | void;
};
export interface CreateRcOnSuccessArgs {
    input: Omit<UseCreateReleaseCandidate, 'onSuccess'>;
    comparisonUrl: string;
    createdTag: string;
    gitReleaseName: string | null;
    gitReleaseUrl: string;
    previousTag?: string;
}
export interface PromoteRcOnSuccessArgs {
    input: Omit<UsePromoteRc, 'onSuccess'>;
    gitReleaseUrl: string;
    gitReleaseName: string | null;
    previousTagUrl: string;
    previousTag: string;
    updatedTagUrl: string;
    updatedTag: string;
}
export interface PatchOnSuccessArgs {
    input: Omit<UsePatch, 'onSuccess'>;
    updatedReleaseUrl: string;
    updatedReleaseName: string | null;
    previousTag: string;
    patchedTag: string;
    patchCommitUrl: string;
    patchCommitMessage: string;
}
export interface ResponseStep {
    message: React.ReactNode;
    secondaryMessage?: string | React.ReactNode;
    link?: string;
    icon?: 'success' | 'failure';
}
export interface CardHook<RunArgs> {
    progress: number;
    responseSteps: ResponseStep[];
    run: (args: RunArgs) => Promise<any>;
    runInvoked: boolean;
}
export interface AlertError {
    title?: string;
    subtitle: string;
}
