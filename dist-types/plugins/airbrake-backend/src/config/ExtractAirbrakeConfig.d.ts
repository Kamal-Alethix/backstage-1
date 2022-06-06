import { Config } from '@backstage/config';
/**
 * The configuration needed for the airbrake-backend plugin
 *
 * @public
 */
export interface AirbrakeConfig {
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
export declare function extractAirbrakeConfig(config: Config): AirbrakeConfig;
