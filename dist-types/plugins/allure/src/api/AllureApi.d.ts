export declare type AllureApi = {
    getReportUrl(projectId: string): Promise<string>;
};
export declare const allureApiRef: import("@backstage/core-plugin-api").ApiRef<AllureApi>;
