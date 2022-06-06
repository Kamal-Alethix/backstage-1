/// <reference types="react" />
export declare type CITableBuildInfo = {
    id: string;
    buildName: string;
    buildUrl?: string;
    startTime?: string;
    stopTime?: string;
    source: {
        branchName: string;
        commit: {
            hash: string;
            shortHash: string;
            url: string;
            committerName?: string;
        };
    };
    status: string;
    tests?: {
        total: number;
        passed: number;
        skipped: number;
        failed: number;
        testUrl: string;
    };
    workflow: {
        id: string;
        url: string;
        name?: string;
        jobName?: string;
    };
    user: {
        isUser: boolean;
        login: string;
        name?: string;
        avatarUrl?: string;
    };
    onRestartClick: () => void;
};
declare type Props = {
    loading: boolean;
    retry: () => void;
    builds: CITableBuildInfo[];
    projectName: string;
    page: number;
    onChangePage: (page: number) => void;
    total: number;
    pageSize: number;
    onChangePageSize: (pageSize: number) => void;
};
export declare const CITable: ({ projectName, loading, pageSize, page, retry, builds, onChangePage, onChangePageSize, total, }: Props) => JSX.Element;
export {};
