import { ApiRef } from '../system';
import { Config } from '@backstage/config';
/**
 * The Config API is used to provide a mechanism to access the
 * runtime configuration of the system.
 *
 * @public
 */
export declare type ConfigApi = Config;
/**
 * The {@link ApiRef} of {@link ConfigApi}.
 *
 * @public
 */
export declare const configApiRef: ApiRef<ConfigApi>;
