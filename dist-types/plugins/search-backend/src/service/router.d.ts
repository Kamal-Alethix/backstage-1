import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PermissionAuthorizer, PermissionEvaluator } from '@backstage/plugin-permission-common';
import { DocumentTypeInfo } from '@backstage/plugin-search-common';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
/**
 * @public
 */
export declare type RouterOptions = {
    engine: SearchEngine;
    types: Record<string, DocumentTypeInfo>;
    permissions: PermissionEvaluator | PermissionAuthorizer;
    config: Config;
    logger: Logger;
};
/**
 * @public
 */
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
