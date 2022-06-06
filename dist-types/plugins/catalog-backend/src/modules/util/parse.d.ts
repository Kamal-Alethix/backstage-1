/// <reference types="node" />
import { CatalogProcessorParser, CatalogProcessorResult, LocationSpec } from '../../api';
/** @public */
export declare function parseEntityYaml(data: Buffer, location: LocationSpec): Iterable<CatalogProcessorResult>;
export declare const defaultEntityDataParser: CatalogProcessorParser;
