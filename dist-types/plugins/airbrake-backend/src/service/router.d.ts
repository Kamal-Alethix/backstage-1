import express from 'express';
import { Logger } from 'winston';
import { AirbrakeConfig } from '../config';
/**
 * The router options that are needed when creating a router.
 *
 * @public
 */
export interface RouterOptions {
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
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
