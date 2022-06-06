/**
 * Store timestamps of the most recent TechDocs update of each Entity. This is
 * used to avoid checking for an update on each and every request to TechDocs.
 */
export declare class BuildMetadataStorage {
    private entityUid;
    private lastUpdatedRecord;
    constructor(entityUid: string);
    setLastUpdated(): void;
    getLastUpdated(): number | undefined;
}
/**
 * Return false if a check for update has happened in last 60 seconds.
 */
export declare const shouldCheckForUpdate: (entityUid: string) => boolean;
