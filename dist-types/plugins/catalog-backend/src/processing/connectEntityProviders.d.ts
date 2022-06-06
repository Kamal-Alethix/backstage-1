import { ProcessingDatabase } from '../database/types';
import { EntityProvider } from '../api';
export declare function connectEntityProviders(db: ProcessingDatabase, providers: EntityProvider[]): Promise<void>;
