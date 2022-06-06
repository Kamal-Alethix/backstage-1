import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

/**
 * The configuration needed for the airbrake-backend plugin
 *
 * @public
 */
interface AirbrakeConfig {
    /**
     * The API Key to authenticate requests. More details on how to get this here: https://airbrake.io/docs/api/#authentication
     */
    apiKey: string;
}
/**
 * Extract the Airbrake config from a config object
 *
 * @public
 *
 * @param config - The config object to extract from
 */
declare function extractAirbrakeConfig(config: Config): AirbrakeConfig;

/**
 * The router options that are needed when creating a router.
 *
 * @public
 */
interface RouterOptions {
    /**
     * A logger object
     */
    logger: Logger;
    /**
     * The Airbrake config obtained from {@link extractAirbrakeConfig}
     */
    airbrakeConfig: AirbrakeConfig;
}
/**
 * Create the Airbrake Router, used for making API calls to the Airbrake API.
 *
 * @public
 *
 * @param options - Router options
 */
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { AirbrakeConfig, RouterOptions, createRouter, extractAirbrakeConfig };
