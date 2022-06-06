export declare class AzureUrl {
    #private;
    /**
     * Parses an azure URL as copied from the browser address bar.
     *
     * Throws an error if the URL is not a valid azure repo URL.
     */
    static fromRepoUrl(repoUrl: string): AzureUrl;
    private constructor();
    /**
     * Returns a repo URL that can be used to navigate to the resource in azure.
     *
     * Throws an error if the URL is not a valid azure repo URL.
     */
    toRepoUrl(): string;
    /**
     * Returns the file download URL for this azure resource.
     *
     * Throws an error if the URL does not point to a file.
     */
    toFileUrl(): string;
    /**
     * Returns the archive download URL for this azure resource.
     *
     * Throws an error if the URL does not point to a repo.
     */
    toArchiveUrl(): string;
    /**
     * Returns the API url for fetching commits from a branch for this azure resource.
     *
     * Throws an error if the URL does not point to a commit.
     */
    toCommitsUrl(): string;
    /**
     * Returns the name of the owner, a user or an organization.
     */
    getOwner(): string;
    /**
     * Returns the name of the project.
     */
    getProject(): string;
    /**
     * Returns the name of the repo.
     */
    getRepo(): string;
    /**
     * Returns the file path within the repo if the URL contains one.
     */
    getPath(): string | undefined;
    /**
     * Returns the git ref in the repo if the URL contains one.
     */
    getRef(): string | undefined;
}
