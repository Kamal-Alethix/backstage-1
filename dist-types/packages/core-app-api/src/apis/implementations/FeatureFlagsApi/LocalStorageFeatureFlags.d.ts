import { FeatureFlagsApi, FeatureFlag, FeatureFlagsSaveOptions } from '@backstage/core-plugin-api';
export declare function validateFlagName(name: string): void;
/**
 * A feature flags implementation that stores the flags in the browser's local
 * storage.
 *
 * @public
 */
export declare class LocalStorageFeatureFlags implements FeatureFlagsApi {
    private registeredFeatureFlags;
    private flags?;
    registerFlag(flag: FeatureFlag): void;
    getRegisteredFlags(): FeatureFlag[];
    isActive(name: string): boolean;
    save(options: FeatureFlagsSaveOptions): void;
    private load;
}
