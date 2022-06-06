import { YarnInfoInspectData } from '../../lib/versioning';
import { JsonObject } from '@backstage/types';
/**
 * TODO: possible types
 *
 * frontend-deps: Install one or many frontend packages in a Backstage app
 * backend-deps: Install one or many backend packages in a Backstage app
 * app-config: Update app-config.yaml (and ask for inputs). E.g. Use local or docker for techdocs.builder
 * frontend-route: Add a frontend route to the plugin homepage
 * backend-route: Add a backend route to the plugin
 * entity-page-tab: Add a tab on Catalog’s entity page
 * sidebar-item: Add a sidebar item
 * frontend-api: Add a custom API
 */
/** A serialized install step as it appears in JSON */
export declare type SerializedStep = {
    type: string;
} & unknown;
export declare type InstallationRecipe = {
    type?: 'frontend' | 'backend';
    steps: SerializedStep[];
    peerPluginDependencies: {
        [pluginId: string]: string;
    };
};
/** package.json data */
export declare type PackageWithInstallRecipe = YarnInfoInspectData & {
    version: string;
    experimentalInstallationRecipe?: InstallationRecipe;
};
export declare type PeerPluginDependencies = Map<string, {
    pkg: PackageWithInstallRecipe;
    versionToInstall?: string;
}>;
export interface Step {
    run(): Promise<void>;
}
export interface StepDefinition<Options> {
    /** The string identifying this type of step */
    type: string;
    /** Deserializes and validate a JSON description of the step data */
    deserialize(obj: JsonObject, pkg: PackageWithInstallRecipe): Step;
    /** Creates a step using known parameters */
    create(options: Options): Step;
}
/** Creates a new step definition. Only used as a helper for type inference */
export declare function createStepDefinition<T>(config: StepDefinition<T>): StepDefinition<T>;
