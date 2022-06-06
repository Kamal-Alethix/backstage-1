export declare type Service = {
    id: string;
    name: string;
    description?: string;
    active_incidents?: string[];
};
export declare type Incident = {
    id: string;
    active: boolean;
    description?: string;
    name: string;
    incident_url: string;
};
