/// <reference types="react" />
import * as _backstage_core_components from '@backstage/core-components';
import { InfoCardVariants } from '@backstage/core-components';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';

declare const jenkinsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityJenkinsContent: (_props: {}) => JSX.Element;
declare const EntityLatestJenkinsRunCard: ({ branch, variant, }: {
    branch: string;
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;

declare const LatestRunCard: ({ branch, variant, }: {
    branch: string;
    variant?: InfoCardVariants | undefined;
}) => JSX.Element;

declare const isJenkinsAvailable: (entity: Entity) => boolean;
declare type Props = {};
declare const Router: (_props: Props) => JSX.Element;

declare const JENKINS_ANNOTATION = "jenkins.io/job-full-name";
declare const LEGACY_JENKINS_ANNOTATION = "jenkins.io/github-folder";

declare const jenkinsApiRef: _backstage_core_plugin_api.ApiRef<JenkinsApi>;
interface Build {
    timestamp: number;
    building: boolean;
    duration: number;
    result?: string;
    fullDisplayName: string;
    displayName: string;
    url: string;
    number: number;
    source?: {
        branchName: string;
        displayName: string;
        url: string;
        commit: {
            hash: string;
        };
        author: string;
    };
    tests: {
        passed: number;
        skipped: number;
        failed: number;
        total: number;
        testUrl: string;
    };
    status: string;
}
interface Project {
    lastBuild: Build;
    displayName: string;
    fullDisplayName: string;
    fullName: string;
    inQueue: string;
    status: string;
    onRestartClick: () => Promise<void>;
}
interface JenkinsApi {
    /**
     * Get the projects (jobs which have builds, not folders) including info about their lastBuild.
     *
     * Deciding what jobs are for an entity can be configured by the backstage _Integrator_ in the plugin-jenkins-backend setup
     * and by the _Software Engineer_ using annotations agreed with the _Integrator_.
     *
     * Typically, a folder job will be identified and the backend plugin will recursively look for projects (jobs with builds) within that folder.
     */
    getProjects(options: {
        /** the entity whose jobs should be retrieved. */
        entity: CompoundEntityRef;
        /** a filter on jobs. Currently this just takes a branch (and assumes certain structures in jenkins) */
        filter: {
            branch?: string;
        };
    }): Promise<Project[]>;
    /**
     * Get a single build.
     *
     * This takes an entity to support selecting between multiple jenkins instances.
     *
     * TODO: abstract jobFullName (so we could support differentiating between the same named job on multiple instances).
     */
    getBuild(options: {
        entity: CompoundEntityRef;
        jobFullName: string;
        buildNumber: string;
    }): Promise<Build>;
    retry(options: {
        entity: CompoundEntityRef;
        jobFullName: string;
        buildNumber: string;
    }): Promise<void>;
}
declare class JenkinsClient implements JenkinsApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    getProjects(options: {
        entity: CompoundEntityRef;
        filter: {
            branch?: string;
        };
    }): Promise<Project[]>;
    getBuild(options: {
        entity: CompoundEntityRef;
        jobFullName: string;
        buildNumber: string;
    }): Promise<Build>;
    retry(options: {
        entity: CompoundEntityRef;
        jobFullName: string;
        buildNumber: string;
    }): Promise<void>;
    private getToken;
}

export { EntityJenkinsContent, EntityLatestJenkinsRunCard, JENKINS_ANNOTATION, JenkinsApi, JenkinsClient, LEGACY_JENKINS_ANNOTATION, LatestRunCard, Router, isJenkinsAvailable, isJenkinsAvailable as isPluginApplicableToEntity, jenkinsApiRef, jenkinsPlugin, jenkinsPlugin as plugin };
