import express from 'express';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { BadgeBuilder } from '../lib/BadgeBuilder';
import { BadgeFactories } from '../types';
export interface RouterOptions {
    badgeBuilder?: BadgeBuilder;
    badgeFactories?: BadgeFactories;
    catalog?: CatalogApi;
    config: Config;
    discovery: PluginEndpointDiscovery;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
