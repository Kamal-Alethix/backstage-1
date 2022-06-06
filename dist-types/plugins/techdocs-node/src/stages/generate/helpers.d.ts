/// <reference types="node" />
import { Entity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { SpawnOptionsWithoutStdio } from 'child_process';
import yaml from 'js-yaml';
import path from 'path';
import { Writable } from 'stream';
import { Logger } from 'winston';
import { ParsedLocationAnnotation } from '../../helpers';
import { SupportedGeneratorKey } from './types';
export declare function getGeneratorKey(entity: Entity): SupportedGeneratorKey;
export declare type RunCommandOptions = {
    /** command to run */
    command: string;
    /** arguments to pass the command */
    args: string[];
    /** options to pass to spawn */
    options: SpawnOptionsWithoutStdio;
    /** stream to capture stdout and stderr output */
    logStream?: Writable;
};
/**
 * Run a command in a sub-process, normally a shell command.
 */
export declare const runCommand: ({ command, args, options, logStream, }: RunCommandOptions) => Promise<void>;
/**
 * Return the source url for MkDocs based on the backstage.io/techdocs-ref annotation.
 * Depending on the type of target, it can either return a repo_url, an edit_uri, both, or none.
 *
 * @param parsedLocationAnnotation - Object with location url and type
 * @param scmIntegrations - the scmIntegration to do url transformations
 * @param docsFolder - the configured docs folder in the mkdocs.yml (defaults to 'docs')
 * @returns the settings for the mkdocs.yml
 */
export declare const getRepoUrlFromLocationAnnotation: (parsedLocationAnnotation: ParsedLocationAnnotation, scmIntegrations: ScmIntegrationRegistry, docsFolder?: string) => {
    repo_url?: string;
    edit_uri?: string;
};
export declare const MKDOCS_SCHEMA: yaml.Schema;
/**
 * Finds and loads the contents of either an mkdocs.yml or mkdocs.yaml file,
 * depending on which is present (MkDocs supports both as of v1.2.2).
 *
 * @param inputDir - base dir to be searched for either an mkdocs.yml or
 *   mkdocs.yaml file.
 */
export declare const getMkdocsYml: (inputDir: string) => Promise<{
    path: string;
    content: string;
}>;
/**
 * Validating mkdocs config file for incorrect/insecure values
 * Throws on invalid configs
 *
 * @param inputDir - base dir to be used as a docs_dir path validity check
 * @param mkdocsYmlFileString - The string contents of the loaded
 *   mkdocs.yml or equivalent of a docs site
 * @returns the parsed docs_dir or undefined
 */
export declare const validateMkdocsYaml: (inputDir: string, mkdocsYmlFileString: string) => Promise<string | undefined>;
/**
 * Update docs/index.md file before TechDocs generator uses it to generate docs site,
 * falling back to docs/README.md or README.md in case a default docs/index.md
 * is not provided.
 */
export declare const patchIndexPreBuild: ({ inputDir, logger, docsDir, }: {
    inputDir: string;
    logger: Logger;
    docsDir?: string | undefined;
}) => Promise<void>;
/**
 * Create or update the techdocs_metadata.json. Values initialized/updated are:
 * - The build_timestamp (now)
 * - The list of files generated
 *
 * @param techdocsMetadataPath - File path to techdocs_metadata.json
 */
export declare const createOrUpdateMetadata: (techdocsMetadataPath: string, logger: Logger) => Promise<void>;
/**
 * Update the techdocs_metadata.json to add etag of the prepared tree (e.g. commit SHA or actual Etag of the resource).
 * This is helpful to check if a TechDocs site in storage has gone outdated, without maintaining an in-memory build info
 * per Backstage instance.
 *
 * @param techdocsMetadataPath - File path to techdocs_metadata.json
 * @param etag - The ETag to use
 */
export declare const storeEtagMetadata: (techdocsMetadataPath: string, etag: string) => Promise<void>;
