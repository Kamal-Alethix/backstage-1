export declare type GraphQlPullRequest<T> = {
    repository: {
        pullRequest: T;
    };
};
export declare type GraphQlPullRequests<T> = {
    repository: {
        pullRequests: {
            edges: T;
        };
    };
};
export declare type PullRequestsNumber = {
    node: {
        number: number;
    };
};
export declare type Review = {
    state: 'PENDING' | 'COMMENTED' | 'APPROVED' | 'CHANGES_REQUESTED' | 'DISMISSED';
    author: Author;
};
export declare type Reviews = Review[];
export declare type Author = {
    login: string;
    avatarUrl: string;
    id: string;
    email: string;
    name: string;
};
export declare type PullRequest = {
    id: string;
    repository: {
        name: string;
    };
    title: string;
    url: string;
    lastEditedAt: string;
    latestReviews: {
        nodes: Reviews;
    };
    mergeable: boolean;
    state: string;
    reviewDecision: ReviewDecision | null;
    isDraft: boolean;
    createdAt: string;
    author: Author;
};
export declare type PullRequests = PullRequest[];
export declare type PullRequestsColumn = {
    title: string;
    content: PullRequests;
};
export declare type PRCardFormating = 'compacted' | 'fullscreen' | 'draft';
export declare type ReviewDecision = 'IN_PROGRESS' | 'APPROVED' | 'REVIEW_REQUIRED';
