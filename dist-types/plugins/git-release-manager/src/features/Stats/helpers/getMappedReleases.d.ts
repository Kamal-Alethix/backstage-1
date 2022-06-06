import { GetAllReleasesResult } from '../../../api/GitReleaseClient';
import { Project } from '../../../contexts/ProjectContext';
import { ReleaseStats } from '../contexts/ReleaseStatsContext';
export declare function getMappedReleases({ allReleases, project, }: {
    allReleases: GetAllReleasesResult['releases'];
    project: Project;
}): {
    mappedReleases: ReleaseStats;
};
