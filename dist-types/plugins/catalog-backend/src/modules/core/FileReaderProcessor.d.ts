import { CatalogProcessor, CatalogProcessorEmit, CatalogProcessorParser, LocationSpec } from '../../api';
/** @public */
export declare class FileReaderProcessor implements CatalogProcessor {
    getProcessorName(): string;
    readLocation(location: LocationSpec, optional: boolean, emit: CatalogProcessorEmit, parser: CatalogProcessorParser): Promise<boolean>;
}
