/**
 * Common analytics context attributes.
 *
 * @alpha
 */
export declare type CommonAnalyticsContext = {
    /**
     * The nearest known parent plugin where the event was captured.
     */
    pluginId: string;
    /**
     * The ID of the routeRef that was active when the event was captured.
     */
    routeRef: string;
    /**
     * The nearest known parent extension where the event was captured.
     */
    extension: string;
};
/**
 * Analytics context envelope.
 *
 * @alpha
 */
export declare type AnalyticsContextValue = CommonAnalyticsContext & {
    [param in string]: string | boolean | number | undefined;
};
