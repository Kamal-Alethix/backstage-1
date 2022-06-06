/// <reference types="react" />
export declare enum DefaultNavigation {
    CostOverviewCard = "cost-overview-card",
    AlertInsightsHeader = "alert-insights-header"
}
export declare type NavigationItem = {
    navigation: string;
    icon: JSX.Element;
    title: string;
};
export declare const getDefaultNavigationItems: (alerts: number) => NavigationItem[];
export declare function getIcon(icon?: string): JSX.Element;
