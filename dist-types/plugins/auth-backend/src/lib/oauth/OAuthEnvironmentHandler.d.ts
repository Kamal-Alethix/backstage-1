import express from 'express';
import { Config } from '@backstage/config';
import { AuthProviderRouteHandlers } from '../../providers/types';
export declare class OAuthEnvironmentHandler implements AuthProviderRouteHandlers {
    private readonly handlers;
    static mapConfig(config: Config, factoryFunc: (envConfig: Config) => AuthProviderRouteHandlers): OAuthEnvironmentHandler;
    constructor(handlers: Map<string, AuthProviderRouteHandlers>);
    start(req: express.Request, res: express.Response): Promise<void>;
    frameHandler(req: express.Request, res: express.Response): Promise<void>;
    refresh(req: express.Request, res: express.Response): Promise<void>;
    logout(req: express.Request, res: express.Response): Promise<void>;
    private getRequestFromEnv;
    private getProviderForEnv;
}
