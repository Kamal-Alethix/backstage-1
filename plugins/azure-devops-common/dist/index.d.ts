declare enum BuildResult {
    /**
     * No result
     */
    None = 0,
    /**
     * The build completed successfully.
     */
    Succeeded = 2,
    /**
     * The build completed compilation successfully but had other errors.
     */
    PartiallySucceeded = 4,
    /**
     * The build completed unsuccessfully.
     */
    Failed = 8,
    /**
     * The build was canceled before starting.
     */
    Canceled = 32
}
declare enum BuildStatus {
    /**
     * No status.
     */
    None = 0,
    /**
     * The build is currently in progress.
     */
    InProgress = 1,
    /**
     * The build has completed.
     */
    Completed = 2,
    /**
     * The build is cancelling
     */
    Cancelling = 4,
    /**
     * The build is inactive in the queue.
     */
    Postponed = 8,
    /**
     * The build has not yet started.
     */
    NotStarted = 32,
    /**
     * All status.
     */
    All = 47
}
declare type RepoBuild = {
    id?: number;
    title: string;
    link?: string;
    status?: BuildStatus;
    result?: BuildResult;
    queueTime?: string;
    startTime?: string;
    finishTime?: string;
    source: string;
    uniqueName?: string;
};
declare type RepoBuildOptions = {
    top?: number;
};
declare enum PullRequestStatus {
    /**
     * Status not set. Default state.
     */
    NotSet = 0,
    /**
     * Pull request is active.
     */
    Active = 1,
    /**
     * Pull request is abandoned.
     */
    Abandoned = 2,
    /**
     * Pull request is completed.
     */
    Completed = 3,
    /**
     * Used in pull request search criteria to include all statuses.
     */
    All = 4
}
declare type GitTag = {
    objectId?: string;
    peeledObjectId?: string;
    name?: string;
    createdBy?: string;
    link: string;
    commitLink: string;
};
declare type PullRequest = {
    pullRequestId?: number;
    repoName?: string;
    title?: string;
    uniqueName?: string;
    createdBy?: string;
    creationDate?: string;
    sourceRefName?: string;
    targetRefName?: string;
    status?: PullRequestStatus;
    isDraft?: boolean;
    link: string;
};
declare type PullRequestOptions = {
    top: number;
    status: PullRequestStatus;
};
interface DashboardPullRequest {
    pullRequestId?: number;
    title?: string;
    description?: string;
    repository?: Repository;
    createdBy?: CreatedBy;
    hasAutoComplete: boolean;
    policies?: Policy[];
    reviewers?: Reviewer[];
    creationDate?: string;
    status?: PullRequestStatus;
    isDraft?: boolean;
    link?: string;
}
interface Reviewer {
    id?: string;
    displayName?: string;
    uniqueName?: string;
    imageUrl?: string;
    isRequired?: boolean;
    isContainer?: boolean;
    voteStatus: PullRequestVoteStatus;
}
interface Policy {
    id?: number;
    type: PolicyType;
    status?: PolicyEvaluationStatus;
    text?: string;
    link?: string;
}
interface CreatedBy {
    id?: string;
    displayName?: string;
    uniqueName?: string;
    imageUrl?: string;
    teamIds?: string[];
    teamNames?: string[];
}
interface Repository {
    id?: string;
    name?: string;
    url?: string;
}
interface Team {
    id?: string;
    name?: string;
    projectId?: string;
    projectName?: string;
    members?: string[];
}
interface TeamMember {
    id?: string;
    displayName?: string;
    uniqueName?: string;
    memberOf?: string[];
}
/**
 * Status of a policy which is running against a specific pull request.
 */
declare enum PolicyEvaluationStatus {
    /**
     * The policy is either queued to run, or is waiting for some event before progressing.
     */
    Queued = 0,
    /**
     * The policy is currently running.
     */
    Running = 1,
    /**
     * The policy has been fulfilled for this pull request.
     */
    Approved = 2,
    /**
     * The policy has rejected this pull request.
     */
    Rejected = 3,
    /**
     * The policy does not apply to this pull request.
     */
    NotApplicable = 4,
    /**
     * The policy has encountered an unexpected error.
     */
    Broken = 5
}
declare enum PolicyType {
    Build = "Build",
    Status = "Status",
    MinimumReviewers = "MinimumReviewers",
    Comments = "Comments",
    RequiredReviewers = "RequiredReviewers",
    MergeStrategy = "MergeStrategy"
}
declare enum PolicyTypeId {
    /**
     * This policy will require a successful build has been performed before updating protected refs.
     */
    Build = "0609b952-1397-4640-95ec-e00a01b2c241",
    /**
     * This policy will require a successful status to be posted before updating protected refs.
     */
    Status = "cbdc66da-9728-4af8-aada-9a5a32e4a226",
    /**
     * This policy will ensure that a minimum number of reviewers have approved a pull request before completion.
     */
    MinimumReviewers = "fa4e907d-c16b-4a4c-9dfa-4906e5d171dd",
    /**
     * Check if the pull request has any active comments.
     */
    Comments = "c6a1889d-b943-4856-b76f-9e46bb6b0df2",
    /**
     * This policy will ensure that required reviewers are added for modified files matching specified patterns.
     */
    RequiredReviewers = "fd2167ab-b0be-447a-8ec8-39368250530e",
    /**
     * This policy ensures that pull requests use a consistent merge strategy.
     */
    MergeStrategy = "fa4e907d-c16b-4a4c-9dfa-4916e5d171ab"
}
declare enum PullRequestVoteStatus {
    Approved = 10,
    ApprovedWithSuggestions = 5,
    NoVote = 0,
    WaitingForAuthor = -5,
    Rejected = -10
}
declare type BuildRun = {
    id?: number;
    title: string;
    link?: string;
    status?: BuildStatus;
    result?: BuildResult;
    queueTime?: string;
    startTime?: string;
    finishTime?: string;
    source: string;
    uniqueName?: string;
};
declare type BuildRunOptions = {
    top?: number;
};

export { BuildResult, BuildRun, BuildRunOptions, BuildStatus, CreatedBy, DashboardPullRequest, GitTag, Policy, PolicyEvaluationStatus, PolicyType, PolicyTypeId, PullRequest, PullRequestOptions, PullRequestStatus, PullRequestVoteStatus, RepoBuild, RepoBuildOptions, Repository, Reviewer, Team, TeamMember };
