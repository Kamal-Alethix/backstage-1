import { Project } from '../contexts/ProjectContext';
export declare const useVersioningStrategyMatchesRepoTags: ({ project, latestReleaseTagName, repositoryName, }: {
    project: Project;
    latestReleaseTagName?: string | undefined;
    repositoryName?: string | undefined;
}) => {
    versioningStrategyMatches: boolean;
};
