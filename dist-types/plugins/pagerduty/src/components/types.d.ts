/// <reference types="react" />
export declare type ChangeEvent = {
    id: string;
    integration: [
        {
            service: Service;
        }
    ];
    source: string;
    html_url: string;
    links: [
        {
            href: string;
            text: string;
        }
    ];
    summary: string;
    timestamp: string;
};
export declare type Incident = {
    id: string;
    title: string;
    status: string;
    html_url: string;
    assignments: [
        {
            assignee: Assignee;
        }
    ];
    serviceId: string;
    created_at: string;
};
export declare type Service = {
    id: string;
    name: string;
    html_url: string;
    integrationKey: string;
    escalation_policy: {
        id: string;
        user: User;
        html_url: string;
    };
};
export declare type OnCall = {
    user: User;
    escalation_level: number;
};
export declare type Assignee = {
    id: string;
    summary: string;
    html_url: string;
};
export declare type User = {
    id: string;
    summary: string;
    email: string;
    html_url: string;
    name: string;
};
export declare type SubHeaderLink = {
    title: string;
    href?: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
};
