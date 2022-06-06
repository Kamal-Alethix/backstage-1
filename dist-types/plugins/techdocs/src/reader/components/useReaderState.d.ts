/**
 * @public
 * A state representation that is used to configure the UI of <Reader />
 */
export declare type ContentStateTypes = 
/** There is nothing to display but a loading indicator */
'CHECKING'
/** There is no content yet -> present a full screen loading page */
 | 'INITIAL_BUILD'
/** There is content, but the backend is about to update it */
 | 'CONTENT_STALE_REFRESHING'
/** There is content, but after a reload, the content will be different */
 | 'CONTENT_STALE_READY'
/** There is content, the backend tried to update it, but failed */
 | 'CONTENT_STALE_ERROR'
/** There is nothing to see but a "not found" page. Is also shown on page load errors */
 | 'CONTENT_NOT_FOUND'
/** There is only the latest and greatest content */
 | 'CONTENT_FRESH';
/**
 * Calculate the state that should be reported to the display component.
 */
export declare function calculateDisplayState({ contentLoading, content, activeSyncState, }: Pick<ReducerState, 'contentLoading' | 'content' | 'activeSyncState'>): ContentStateTypes;
/**
 * The state of the synchronization task. It checks whether the docs are
 * up-to-date. If they aren't, it triggers a build.
 */
declare type SyncStates = 
/** Checking if it should be synced */
'CHECKING'
/** Building the documentation */
 | 'BUILDING'
/** Finished building the documentation */
 | 'BUILD_READY'
/**
 * Finished building the documentation and triggered a content reload.
 * This state is left toward UP_TO_DATE when the content loading has finished.
 */
 | 'BUILD_READY_RELOAD'
/** No need for a sync. The content was already up-to-date. */
 | 'UP_TO_DATE'
/** An error occurred */
 | 'ERROR';
declare type ReducerActions = {
    type: 'sync';
    state: SyncStates;
    syncError?: Error;
} | {
    type: 'contentLoading';
} | {
    type: 'content';
    path?: string;
    content?: string;
    contentError?: Error;
} | {
    type: 'buildLog';
    log: string;
};
declare type ReducerState = {
    /**
     * The path of the current page
     */
    path: string;
    /**
     * The current sync state
     */
    activeSyncState: SyncStates;
    /**
     * If true, the content is downloading from the storage.
     */
    contentLoading: boolean;
    /**
     * The content that has been downloaded and should be displayed.
     */
    content?: string;
    contentError?: Error;
    syncError?: Error;
    /**
     * A list of log messages that were emitted by the build process.
     */
    buildLog: string[];
};
export declare function reducer(oldState: ReducerState, action: ReducerActions): ReducerState;
/**
 * @public shared reader state
 */
export declare type ReaderState = {
    state: ContentStateTypes;
    path: string;
    contentReload: () => void;
    content?: string;
    contentErrorMessage?: string;
    syncErrorMessage?: string;
    buildLog: string[];
};
export declare function useReaderState(kind: string, namespace: string, name: string, path: string): ReaderState;
export {};
