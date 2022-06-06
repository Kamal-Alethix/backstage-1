import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { GeneratorBuilder, PreparerBuilder, PublisherBase } from '@backstage/plugin-techdocs-node';
import * as winston from 'winston';
import { TechDocsCache } from '../cache';
export declare type DocsSynchronizerSyncOpts = {
    log: (message: string) => void;
    error: (e: Error) => void;
    finish: (result: {
        updated: boolean;
    }) => void;
};
export declare class DocsSynchronizer {
    private readonly publisher;
    private readonly logger;
    private readonly buildLogTransport;
    private readonly config;
    private readonly scmIntegrations;
    private readonly cache;
    private readonly buildLimiter;
    constructor({ publisher, logger, buildLogTransport, config, scmIntegrations, cache, }: {
        publisher: PublisherBase;
        logger: winston.Logger;
        buildLogTransport: winston.transport;
        config: Config;
        scmIntegrations: ScmIntegrationRegistry;
        cache: TechDocsCache | undefined;
    });
    doSync({ responseHandler: { log, error, finish }, entity, preparers, generators, }: {
        responseHandler: DocsSynchronizerSyncOpts;
        entity: Entity;
        preparers: PreparerBuilder;
        generators: GeneratorBuilder;
    }): Promise<void>;
    doCacheSync({ responseHandler: { finish }, discovery, token, entity, }: {
        responseHandler: DocsSynchronizerSyncOpts;
        discovery: PluginEndpointDiscovery;
        token: string | undefined;
        entity: Entity;
    }): Promise<void>;
}
