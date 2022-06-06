export declare type SupportItemLink = {
    url: string;
    title: string;
};
export declare type SupportItem = {
    title: string;
    icon?: string;
    links: SupportItemLink[];
};
export declare type SupportConfig = {
    url: string;
    items: SupportItem[];
};
export declare function useSupportConfig(): SupportConfig;
