import type { JenkinsInfo } from './jenkinsInfoProvider';
import type { BackstageBuild, BackstageProject } from '../types';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
export declare class JenkinsApiImpl {
    private readonly permissionApi?;
    private static readonly lastBuildTreeSpec;
    private static readonly jobTreeSpec;
    private static readonly jobsTreeSpec;
    constructor(permissionApi?: PermissionEvaluator | undefined);
    /**
     * Get a list of projects for the given JenkinsInfo.
     * @see ../../../jenkins/src/api/JenkinsApi.ts#getProjects
     */
    getProjects(jenkinsInfo: JenkinsInfo, branch?: string): Promise<BackstageProject[]>;
    /**
     * Get a single build.
     * @see ../../../jenkins/src/api/JenkinsApi.ts#getBuild
     */
    getBuild(jenkinsInfo: JenkinsInfo, jobFullName: string, buildNumber: number): Promise<BackstageBuild>;
    /**
     * Trigger a build of a project
     * @see ../../../jenkins/src/api/JenkinsApi.ts#retry
     */
    buildProject(jenkinsInfo: JenkinsInfo, jobFullName: string, resourceRef: string, options?: {
        token?: string;
    }): Promise<void>;
    private static getClient;
    private augmentProject;
    private augmentBuild;
    private static extractScmDetailsFromJob;
    private getTestReport;
}
