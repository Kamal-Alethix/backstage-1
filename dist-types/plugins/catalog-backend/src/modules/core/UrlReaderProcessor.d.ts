import { UrlReader } from '@backstage/backend-common';
import { Logger } from 'winston';
import { CatalogProcessor, CatalogProcessorCache, CatalogProcessorEmit, CatalogProcessorParser, LocationSpec } from '../../api';
/** @public */
export declare class UrlReaderProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: {
        reader: UrlReader;
        logger: Logger;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, optional: boolean, emit: CatalogProcessorEmit, parser: CatalogProcessorParser, cache: CatalogProcessorCache): Promise<boolean>;
    private doRead;
}
