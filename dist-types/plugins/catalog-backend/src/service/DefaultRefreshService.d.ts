import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { RefreshOptions, RefreshService } from './types';
export declare class DefaultRefreshService implements RefreshService {
    private database;
    constructor(options: {
        database: DefaultProcessingDatabase;
    });
    refresh(options: RefreshOptions): Promise<void>;
}
