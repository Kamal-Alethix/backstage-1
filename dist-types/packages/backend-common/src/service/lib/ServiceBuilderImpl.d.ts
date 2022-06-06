/// <reference types="node" />
/// <reference types="webpack-env" />
import { Config } from '@backstage/config';
import cors from 'cors';
import { Router, ErrorRequestHandler } from 'express';
import { ContentSecurityPolicyOptions } from 'helmet/dist/types/middlewares/content-security-policy';
import * as http from 'http';
import { Logger } from 'winston';
import { RequestLoggingHandlerFactory, ServiceBuilder } from '../types';
import { CspOptions, HttpsSettings } from './config';
export declare const DEFAULT_PORT = 7007;
export declare class ServiceBuilderImpl implements ServiceBuilder {
    private port;
    private host;
    private logger;
    private corsOptions;
    private cspOptions;
    private httpsSettings;
    private routers;
    private requestLoggingHandler;
    private errorHandler;
    private useDefaultErrorHandler;
    private module;
    constructor(moduleRef: NodeModule);
    loadConfig(config: Config): ServiceBuilder;
    setPort(port: number): ServiceBuilder;
    setHost(host: string): ServiceBuilder;
    setLogger(logger: Logger): ServiceBuilder;
    setHttpsSettings(settings: HttpsSettings): ServiceBuilder;
    enableCors(options: cors.CorsOptions): ServiceBuilder;
    setCsp(options: CspOptions): ServiceBuilder;
    addRouter(root: string, router: Router): ServiceBuilder;
    setRequestLoggingHandler(requestLoggingHandler: RequestLoggingHandlerFactory): this;
    setErrorHandler(errorHandler: ErrorRequestHandler): this;
    disableDefaultErrorHandler(): this;
    start(): Promise<http.Server>;
    private getOptions;
}
export declare function applyCspDirectives(directives: Record<string, string[] | false> | undefined): ContentSecurityPolicyOptions['directives'];
