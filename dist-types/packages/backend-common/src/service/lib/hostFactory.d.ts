/// <reference types="node" />
import express from 'express';
import * as http from 'http';
import { Logger } from 'winston';
import { HttpsSettings } from './config';
/**
 * Creates a Http server instance based on an Express application.
 *
 * @param app - The Express application object
 * @param logger - Optional Winston logger object
 * @returns A Http server instance
 *
 */
export declare function createHttpServer(app: express.Express, logger?: Logger): http.Server;
/**
 * Creates a Https server instance based on an Express application.
 *
 * @param app - The Express application object
 * @param httpsSettings - HttpsSettings for self-signed certificate generation
 * @param logger - Optional Winston logger object
 * @returns A Https server instance
 *
 */
export declare function createHttpsServer(app: express.Express, httpsSettings: HttpsSettings, logger?: Logger): Promise<http.Server>;
