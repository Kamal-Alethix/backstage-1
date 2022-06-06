import { CatalogApi } from '@backstage/catalog-client';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { PermissionEvaluator, PermissionAuthorizer } from '@backstage/plugin-permission-common';

interface JenkinsInfoProvider {
    getInstance(options: {
        /**
         * The entity to get the info about.
         */
        entityRef: CompoundEntityRef;
        /**
         * A specific job to get. This is only passed in when we know about a job name we are interested in.
         */
        jobFullName?: string;
        backstageToken?: string;
    }): Promise<JenkinsInfo>;
}
interface JenkinsInfo {
    baseUrl: string;
    headers?: Record<string, string | string[]>;
    jobFullName: string;
    crumbIssuer?: boolean;
}
interface JenkinsInstanceConfig {
    name: string;
    baseUrl: string;
    username: string;
    apiKey: string;
    crumbIssuer?: boolean;
}
/**
 * Holds multiple Jenkins configurations.
 */
declare class JenkinsConfig {
    readonly instances: JenkinsInstanceConfig[];
    constructor(instances: JenkinsInstanceConfig[]);
    /**
     * Read all Jenkins instance configurations.
     * @param config - Root configuration
     * @returns A JenkinsConfig that contains all configured Jenkins instances.
     */
    static fromConfig(config: Config): JenkinsConfig;
    /**
     * Gets a Jenkins instance configuration by name, or the default one if no
     * name is provided.
     * @param jenkinsName - Optional name of the Jenkins instance.
     * @returns The requested Jenkins instance.
     */
    getInstanceConfig(jenkinsName?: string): JenkinsInstanceConfig;
}
/**
 * Use default config and annotations, build using fromConfig static function.
 *
 * This will fallback through various deprecated config and annotation schemes.
 */
declare class DefaultJenkinsInfoProvider implements JenkinsInfoProvider {
    private readonly config;
    private readonly catalog;
    static readonly OLD_JENKINS_ANNOTATION = "jenkins.io/github-folder";
    static readonly NEW_JENKINS_ANNOTATION = "jenkins.io/job-full-name";
    private constructor();
    static fromConfig(options: {
        config: Config;
        catalog: CatalogApi;
    }): DefaultJenkinsInfoProvider;
    getInstance(opt: {
        entityRef: CompoundEntityRef;
        jobFullName?: string;
        backstageToken?: string;
    }): Promise<JenkinsInfo>;
    private static getEntityAnnotationValue;
}

interface RouterOptions {
    logger: Logger;
    jenkinsInfoProvider: JenkinsInfoProvider;
    permissions?: PermissionEvaluator | PermissionAuthorizer;
}
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { DefaultJenkinsInfoProvider, JenkinsConfig, JenkinsInfo, JenkinsInfoProvider, JenkinsInstanceConfig, RouterOptions, createRouter };
