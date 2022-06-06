export declare type GerritProjectInfo = {
    id: string;
    name: string;
    parent?: string;
    state?: string;
};
export declare type GerritProjectQueryResult = Record<string, GerritProjectInfo>;
export declare type GerritProviderConfig = {
    host: string;
    query: string;
    id: string;
    branch?: string;
};
