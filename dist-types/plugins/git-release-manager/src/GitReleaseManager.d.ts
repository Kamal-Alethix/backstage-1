import React from 'react';
import { ComponentConfig, CreateRcOnSuccessArgs, PatchOnSuccessArgs, PromoteRcOnSuccessArgs } from './types/types';
import { Project } from './contexts/ProjectContext';
import { GetBranchResult, GetLatestReleaseResult, GetRepositoryResult } from './api/GitReleaseClient';
interface GitReleaseManagerProps {
    project?: Omit<Project, 'isProvidedViaProps'>;
    features?: {
        info?: Pick<ComponentConfig<void>, 'omit'>;
        stats?: Pick<ComponentConfig<void>, 'omit'>;
        createRc?: ComponentConfig<CreateRcOnSuccessArgs>;
        promoteRc?: ComponentConfig<PromoteRcOnSuccessArgs>;
        patch?: ComponentConfig<PatchOnSuccessArgs>;
        custom?: {
            factory: ({ latestRelease, project, releaseBranch, repository, }: {
                latestRelease: GetLatestReleaseResult['latestRelease'] | null;
                project: Project;
                releaseBranch: GetBranchResult['branch'] | null;
                repository: GetRepositoryResult['repository'];
            }) => React.ReactElement | React.ReactElement[];
        };
    };
}
export declare function GitReleaseManager(props: GitReleaseManagerProps): JSX.Element;
export {};
