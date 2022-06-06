import { Logger } from 'winston';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { KeyStore } from './types';
declare type Options = {
    logger?: Logger;
    database?: PluginDatabaseManager;
};
export declare class KeyStores {
    /**
     * Looks at the `auth.keyStore` section in the application configuration
     * and returns a KeyStore store. Defaults to `database`
     *
     * @returns a KeyStore store
     */
    static fromConfig(config: Config, options?: Options): Promise<KeyStore>;
}
export {};
