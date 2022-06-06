export declare type Project = {
    name: string;
    projectNumber?: string;
    projectId: string;
    lifecycleState?: string;
    createTime?: string;
};
export declare type ProjectDetails = {
    details: string;
};
export declare type Operation = {
    name: string;
    metadata: string;
    done: boolean;
    error: Status;
    response: string;
};
export declare type Status = {
    code: number;
    message: string;
    details: string[];
};
