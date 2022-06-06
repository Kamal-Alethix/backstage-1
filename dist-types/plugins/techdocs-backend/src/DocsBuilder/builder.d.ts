/// <reference types="node" />
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { GeneratorBuilder, PreparerBuilder, PublisherBase } from '@backstage/plugin-techdocs-node';
import { Writable } from 'stream';
import { Logger } from 'winston';
import { TechDocsCache } from '../cache';
declare type DocsBuilderArguments = {
    preparers: PreparerBuilder;
    generators: GeneratorBuilder;
    publisher: PublisherBase;
    entity: Entity;
    logger: Logger;
    config: Config;
    scmIntegrations: ScmIntegrationRegistry;
    logStream?: Writable;
    cache?: TechDocsCache;
};
export declare class DocsBuilder {
    private preparer;
    private generator;
    private publisher;
    private entity;
    private logger;
    private config;
    private scmIntegrations;
    private logStream;
    private cache?;
    constructor({ preparers, generators, publisher, entity, logger, config, scmIntegrations, logStream, cache, }: DocsBuilderArguments);
    /**
     * Build the docs and return whether they have been newly generated or have been cached
     * @returns true, if the docs have been built. false, if the cached docs are still up-to-date.
     */
    build(): Promise<boolean>;
}
export {};
