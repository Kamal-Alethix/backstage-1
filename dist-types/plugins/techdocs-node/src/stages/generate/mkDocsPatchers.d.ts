import { Logger } from 'winston';
import { ParsedLocationAnnotation } from '../../helpers';
import { ScmIntegrationRegistry } from '@backstage/integration';
/**
 * Update the mkdocs.yml file before TechDocs generator uses it to generate docs site.
 *
 * List of tasks:
 * - Add repo_url or edit_uri if it does not exists
 * If mkdocs.yml has a repo_url, the generated docs site gets an Edit button on the pages by default.
 * If repo_url is missing in mkdocs.yml, we will use techdocs annotation of the entity to possibly get
 * the repository URL.
 *
 * This function will not throw an error since this is not critical to the whole TechDocs pipeline.
 * Instead it will log warnings if there are any errors in reading, parsing or writing YAML.
 *
 * @param mkdocsYmlPath - Absolute path to mkdocs.yml or equivalent of a docs site
 * @param logger - A logger instance
 * @param parsedLocationAnnotation - Object with location url and type
 * @param scmIntegrations - the scmIntegration to do url transformations
 */
export declare const patchMkdocsYmlPreBuild: (mkdocsYmlPath: string, logger: Logger, parsedLocationAnnotation: ParsedLocationAnnotation, scmIntegrations: ScmIntegrationRegistry) => Promise<void>;
/**
 * Update the mkdocs.yml file before TechDocs generator uses it to generate docs site.
 *
 * List of tasks:
 * - Add techdocs-core plugin to mkdocs file if it doesn't exist
 *
 * This function will not throw an error since this is not critical to the whole TechDocs pipeline.
 * Instead it will log warnings if there are any errors in reading, parsing or writing YAML.
 *
 * @param mkdocsYmlPath - Absolute path to mkdocs.yml or equivalent of a docs site
 * @param logger - A logger instance
 */
export declare const pathMkdocsYmlWithTechdocsPlugin: (mkdocsYmlPath: string, logger: Logger) => Promise<void>;
