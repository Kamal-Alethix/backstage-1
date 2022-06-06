export interface FindingSummary {
    timestamp: string;
    issueCount: number;
    dependencyCount: number;
    projectDefaultBranch: string;
    projectUrl: string;
}
export declare const fossaApiRef: import("@backstage/core-plugin-api").ApiRef<FossaApi>;
export declare type FossaApi = {
    /**
     * Get the finding summary for a list of projects
     *
     * @param projectTitles - a list of project titles in FOSSA
     */
    getFindingSummaries(projectTitles: Array<string>): Promise<Map<string, FindingSummary>>;
    /**
     * Get the finding summary of a single project.
     *
     * @param projectTitle - the project title in FOSSA
     */
    getFindingSummary(projectTitle: string): Promise<FindingSummary | undefined>;
};
