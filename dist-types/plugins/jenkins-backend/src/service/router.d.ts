import express from 'express';
import { Logger } from 'winston';
import { JenkinsInfoProvider } from './jenkinsInfoProvider';
import { PermissionAuthorizer, PermissionEvaluator } from '@backstage/plugin-permission-common';
export interface RouterOptions {
    logger: Logger;
    jenkinsInfoProvider: JenkinsInfoProvider;
    permissions?: PermissionEvaluator | PermissionAuthorizer;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
