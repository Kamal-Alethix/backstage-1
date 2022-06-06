import { ComponentType } from 'react';
import { IconComponent, BackstagePlugin } from '@backstage/core-plugin-api';
import { AppComponents, AppOptions, BackstageApp } from './types';
export declare class AppManager implements BackstageApp {
    private apiHolder?;
    private configApi?;
    private readonly apis;
    private readonly icons;
    private readonly plugins;
    private readonly components;
    private readonly themes;
    private readonly configLoader?;
    private readonly defaultApis;
    private readonly bindRoutes;
    private readonly appIdentityProxy;
    private readonly apiFactoryRegistry;
    constructor(options: AppOptions);
    getPlugins(): BackstagePlugin<any, any>[];
    getSystemIcon(key: string): IconComponent | undefined;
    getComponents(): AppComponents;
    getProvider(): ComponentType<{}>;
    getRouter(): ComponentType<{}>;
    private getApiHolder;
    private verifyPlugins;
}
