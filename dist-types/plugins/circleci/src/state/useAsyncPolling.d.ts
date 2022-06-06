export declare const useAsyncPolling: (pollingFn: () => Promise<any>, interval: number) => {
    startPolling: () => Promise<void>;
    stopPolling: () => void;
};
