import { StorageApi } from '@backstage/core-plugin-api';
/**
 * Migrate the starred entities from the old format (entity:<kind>:<namespace>:<name>) from the
 * old storage location (/settings/starredEntities) to entity references in the new location
 * (/starredEntities/entityRefs).
 *
 * This will only be executed once since the old location is cleared.
 *
 * @param storageApi - the StorageApi to migrate
 */
export declare function performMigrationToTheNewBucket({ storageApi, }: {
    storageApi: StorageApi;
}): Promise<void>;
