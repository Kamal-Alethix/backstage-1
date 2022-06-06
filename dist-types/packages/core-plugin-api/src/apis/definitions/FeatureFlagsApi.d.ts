import { ApiRef } from '../system';
/**
 * Feature flag descriptor.
 *
 * @public
 */
export declare type FeatureFlag = {
    name: string;
    pluginId: string;
};
/**
 * Enum representing the state of a feature flag (inactive/active).
 *
 * @public
 */
export declare enum FeatureFlagState {
    /**
     * Feature flag inactive (disabled).
     */
    None = 0,
    /**
     * Feature flag active (enabled).
     */
    Active = 1
}
/**
 * Options to use when saving feature flags.
 *
 * @public
 */
export declare type FeatureFlagsSaveOptions = {
    /**
     * The new feature flag states to save.
     */
    states: Record<string, FeatureFlagState>;
    /**
     * Whether the saves states should be merged into the existing ones, or replace them.
     *
     * Defaults to false.
     */
    merge?: boolean;
};
/**
 * The feature flags API is used to toggle functionality to users across plugins and Backstage.
 *
 * @remarks
 *
 * Plugins can use this API to register feature flags that they have available
 * for users to enable/disable, and this API will centralize the current user's
 * state of which feature flags they would like to enable.
 *
 * This is ideal for Backstage plugins, as well as your own App, to trial incomplete
 * or unstable upcoming features. Although there will be a common interface for users
 * to enable and disable feature flags, this API acts as another way to enable/disable.
 *
 * @public
 */
export interface FeatureFlagsApi {
    /**
     * Registers a new feature flag. Once a feature flag has been registered it
     * can be toggled by users, and read back to enable or disable features.
     */
    registerFlag(flag: FeatureFlag): void;
    /**
     * Get a list of all registered flags.
     */
    getRegisteredFlags(): FeatureFlag[];
    /**
     * Whether the feature flag with the given name is currently activated for the user.
     */
    isActive(name: string): boolean;
    /**
     * Save the user's choice of feature flag states.
     */
    save(options: FeatureFlagsSaveOptions): void;
}
/**
 * The {@link ApiRef} of {@link FeatureFlagsApi}.
 *
 * @public
 */
export declare const featureFlagsApiRef: ApiRef<FeatureFlagsApi>;
