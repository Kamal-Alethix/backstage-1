/**
 * Sets up handlers for request mocking
 * @public
 * @param worker - service worker
 */
export declare function setupRequestMockHandlers(worker: {
    listen: (t: any) => void;
    close: () => void;
    resetHandlers: () => void;
}): void;
