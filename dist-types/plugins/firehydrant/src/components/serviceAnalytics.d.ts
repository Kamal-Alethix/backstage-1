export declare const useServiceAnalytics: ({ serviceId, startDate, endDate, }: {
    serviceId: string;
    startDate: string;
    endDate: string;
}) => {
    loading: boolean;
    value: import("../api/types").ServiceAnalyticsResponse | undefined;
    error: Error | undefined;
    retry: (() => void) | (() => void) | (() => void) | (() => void);
};
