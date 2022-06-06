export declare const useServiceDetails: ({ serviceName }: {
    serviceName: string;
}) => {
    loading: boolean;
    value: import("../api/types").ServiceDetailsResponse | undefined;
    error: Error | undefined;
    retry: (() => void) | (() => void) | (() => void) | (() => void);
};
