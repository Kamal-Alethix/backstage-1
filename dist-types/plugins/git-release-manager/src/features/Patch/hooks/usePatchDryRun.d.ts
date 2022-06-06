import { CalverTagParts } from '../../../helpers/tagParts/getCalverTagParts';
import { GetRecentCommitsResultSingle } from '../../../api/GitReleaseClient';
import { Project } from '../../../contexts/ProjectContext';
import { SemverTagParts } from '../../../helpers/tagParts/getSemverTagParts';
export interface UsePatchDryRun {
    bumpedTag: string;
    releaseBranchName: string;
    project: Project;
    tagParts: NonNullable<CalverTagParts | SemverTagParts>;
}
export declare function usePatchDryRun({ bumpedTag, releaseBranchName, project, tagParts, }: UsePatchDryRun): {
    TOTAL_PATCH_PREP_STEPS: number;
    run: (selectedPatchCommit: GetRecentCommitsResultSingle) => Promise<{
        latestCommit: {
            sha: string;
            htmlUrl: string;
            commit: {
                message: string;
            };
            createdAt?: string | undefined;
        };
        selectedPatchCommit: {
            htmlUrl: string;
            sha: string;
            author: {
                htmlUrl?: string | undefined;
                login?: string | undefined;
            };
            commit: {
                message: string;
            };
            firstParentSha?: string | undefined;
        };
    }>;
    runInvoked: boolean;
    lastCallRes: import("react-use/lib/useAsyncFn").AsyncState<{
        deletedReferenceSuccess: boolean;
    } | undefined>;
    responseSteps: import("../../../types/types").ResponseStep[];
    addStepToResponseSteps: (responseStep: import("../../../types/types").ResponseStep) => void;
    asyncCatcher: (error: Error) => never;
    abortIfError: (error?: Error | undefined) => void;
    selectedPatchCommit: {
        htmlUrl: string;
        sha: string;
        author: {
            htmlUrl?: string | undefined;
            login?: string | undefined;
        };
        commit: {
            message: string;
        };
        firstParentSha?: string | undefined;
    };
};
