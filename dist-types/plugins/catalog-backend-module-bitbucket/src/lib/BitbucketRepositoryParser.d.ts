import { BitbucketIntegration } from '@backstage/integration';
import { CatalogProcessorResult } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * A custom callback that reacts to finding a repository by yielding processing
 * results.
 *
 * @public
 */
export declare type BitbucketRepositoryParser = (options: {
    integration: BitbucketIntegration;
    target: string;
    presence?: 'optional' | 'required';
    logger: Logger;
}) => AsyncIterable<CatalogProcessorResult>;
export declare const defaultRepositoryParser: (options: {
    target: string;
    presence?: 'optional' | 'required';
}) => AsyncGenerator<CatalogProcessorResult, void, unknown>;
