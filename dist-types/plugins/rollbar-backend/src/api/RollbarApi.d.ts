import { Logger } from 'winston';
export declare class RollbarApi {
    private readonly accessToken;
    private readonly logger;
    private projectMap;
    constructor(accessToken: string, logger: Logger);
    getAllProjects(): Promise<{
        id: number;
        name: string;
        status: string;
        accountId: number;
    }[]>;
    getProject(projectName: string): Promise<{
        id: number;
        name: string;
        status: string;
        accountId: number;
    }>;
    getProjectItems(projectName: string): Promise<{
        items: import("./types").RollbarItem[];
        page: number;
        totalCount: number;
    }>;
    getTopActiveItems(projectName: string, options?: {
        hours: number;
        environment: string;
    }): Promise<{
        item: {
            id: number;
            counter: number;
            environment: string;
            framework: import("./types").RollbarFrameworkId;
            lastOccurrenceTimestamp: number;
            level: number;
            occurrences: number;
            projectId: number;
            title: string;
            uniqueOccurrences: number;
        };
        counts: number[];
    }[]>;
    getOccuranceCounts(projectName: string, options?: {
        environment: string;
        item_id?: number;
    }): Promise<{
        timestamp: number;
        count: number;
    }[]>;
    getActivatedCounts(projectName: string, options?: {
        environment: string;
        item_id?: number;
    }): Promise<{
        timestamp: number;
        count: number;
    }[]>;
    private getProjectAccessTokens;
    private get;
    private getForProject;
    private getProjectMetadata;
    private getProjectMap;
}
export declare function getRequestHeaders(token: string): {
    headers: {
        'X-Rollbar-Access-Token': string;
    };
};
