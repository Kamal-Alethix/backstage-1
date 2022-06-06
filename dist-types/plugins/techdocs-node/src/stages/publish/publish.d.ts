import { Config } from '@backstage/config';
import { PublisherFactory, PublisherBase } from './types';
/**
 * Factory class to create a TechDocs publisher based on defined publisher type in app config.
 * Uses `techdocs.publisher.type`.
 * @public
 */
export declare class Publisher {
    /**
     * Returns a instance of TechDocs publisher
     * @param config - A Backstage configuration
     * @param options - Options for configuring the publisher factory
     */
    static fromConfig(config: Config, { logger, discovery }: PublisherFactory): Promise<PublisherBase>;
}
