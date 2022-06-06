/// <reference types="react" />
import { GetBranchResult, GetLatestReleaseResult } from '../../api/GitReleaseClient';
import { CalverTagParts } from '../../helpers/tagParts/getCalverTagParts';
import { ComponentConfig, PatchOnSuccessArgs } from '../../types/types';
import { SemverTagParts } from '../../helpers/tagParts/getSemverTagParts';
interface PatchBodyProps {
    bumpedTag: string;
    latestRelease: NonNullable<GetLatestReleaseResult['latestRelease']>;
    releaseBranch: GetBranchResult['branch'];
    onSuccess?: ComponentConfig<PatchOnSuccessArgs>['onSuccess'];
    tagParts: NonNullable<CalverTagParts | SemverTagParts>;
    ctaMessage: string;
}
export declare const PatchBody: ({ bumpedTag, latestRelease, releaseBranch, onSuccess, tagParts, ctaMessage, }: PatchBodyProps) => JSX.Element;
export {};
