import { CardHook, ComponentConfig, PatchOnSuccessArgs } from '../../../types/types';
import { GetLatestReleaseResult, GetRecentCommitsResultSingle } from '../../../api/GitReleaseClient';
import { CalverTagParts } from '../../../helpers/tagParts/getCalverTagParts';
import { Project } from '../../../contexts/ProjectContext';
import { SemverTagParts } from '../../../helpers/tagParts/getSemverTagParts';
export interface UsePatch {
    bumpedTag: string;
    latestRelease: NonNullable<GetLatestReleaseResult['latestRelease']>;
    project: Project;
    tagParts: NonNullable<CalverTagParts | SemverTagParts>;
    onSuccess?: ComponentConfig<PatchOnSuccessArgs>['onSuccess'];
}
export declare function usePatch({ bumpedTag, latestRelease, project, tagParts, onSuccess, }: UsePatch): CardHook<GetRecentCommitsResultSingle>;
