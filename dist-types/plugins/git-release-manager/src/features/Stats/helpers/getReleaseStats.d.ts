import { GetAllTagsResult } from '../../../api/GitReleaseClient';
import { Project } from '../../../contexts/ProjectContext';
import { ReleaseStats } from '../contexts/ReleaseStatsContext';
export declare function getReleaseStats({ allTags, project, mappedReleases, }: {
    allTags: GetAllTagsResult['tags'];
    project: Project;
    mappedReleases: ReleaseStats;
}): {
    releaseStats: {
        unmappableTags: string[];
        unmatchedTags: string[];
        unmatchedReleases: string[];
        releases: {
            [baseVersion: string]: {
                baseVersion: string;
                createdAt: string | null;
                htmlUrl: string;
                candidates: {
                    tagName: string;
                    tagSha: string;
                    tagType: "commit" | "tag";
                }[];
                versions: {
                    tagName: string;
                    tagSha: string;
                    tagType: "commit" | "tag";
                }[];
            };
        };
    };
};
