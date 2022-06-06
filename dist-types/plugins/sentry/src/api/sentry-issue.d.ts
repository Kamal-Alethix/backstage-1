declare type SentryPlatform = 'javascript' | 'javascript-react' | string;
declare type EventPoint = number[];
declare type SentryProject = {
    platform: SentryPlatform;
    slug: string;
    id: string;
    name: string;
};
declare type SentryIssueMetadata = {
    function?: string;
    type?: string;
    value?: string;
    filename?: string;
};
export declare type SentryIssue = {
    platform: SentryPlatform;
    lastSeen: string;
    numComments: number;
    userCount: number;
    stats: {
        '24h'?: EventPoint[];
        '14d'?: EventPoint[];
    };
    culprit: string;
    title: string;
    id: string;
    assignedTo: any;
    logger: any;
    type: string;
    annotations: any[];
    metadata: SentryIssueMetadata;
    status: string;
    subscriptionDetails: any;
    isPublic: boolean;
    hasSeen: boolean;
    shortId: string;
    shareId: string | null;
    firstSeen: string;
    count: string;
    permalink: string;
    level: string;
    isSubscribed: boolean;
    isBookmarked: boolean;
    project: SentryProject;
    statusDetails: any;
};
export declare type SentryApiError = {
    detail: string;
};
export {};
