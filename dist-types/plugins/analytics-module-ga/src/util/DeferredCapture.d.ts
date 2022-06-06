import ReactGA from 'react-ga';
/**
 * A wrapper around ReactGA that can optionally handle latent capture logic.
 *
 * - When defer is `false`, event data is sent directly to GA.
 * - When defer is `true`, event data is queued (with a timestamp), so that it
 *   can be sent to GA once externally indicated to be ready. This relies on
 *   the `qt` or `queueTime` parameter of the Measurement Protocol.
 *
 * @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt
 */
export declare class DeferredCapture {
    /**
     * Queue of deferred hits to be processed when ready. When undefined, hits
     * can safely be sent without delay.
     */
    private queue;
    constructor({ defer }: {
        defer: boolean;
    });
    /**
     * Indicates that deferred capture may now proceed.
     */
    setReady(): void;
    /**
     * Either forwards the pageview directly to GA, or (if configured) enqueues
     * the pageview hit to be captured when ready.
     */
    pageview(path: string, metadata?: ReactGA.FieldsObject): void;
    /**
     * Either forwards the event directly to GA, or (if configured) enqueues the
     * event hit to be captured when ready.
     */
    event(eventDetails: ReactGA.EventArgs): void;
    /**
     * Sends a given hit to GA, decorated with the correct queue time.
     */
    private sendDeferred;
}
