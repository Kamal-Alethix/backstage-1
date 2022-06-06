/// <reference types="react" />
import { VERSIONING_STRATEGIES } from '../constants/constants';
export interface Project {
    /**
     * Repository's owner (user or organisation)
     *
     * @example erikengervall
     */
    owner: string;
    /**
     * Repository's name
     *
     * @example dockest
     */
    repo: string;
    /**
     * Declares the versioning strategy of the project
     *
     * semver: `1.2.3` (major.minor.patch)
     * calver: `2020.01.01_0` (YYYY.0M.0D_patch)
     *
     * Default: false
     */
    versioningStrategy: keyof typeof VERSIONING_STRATEGIES;
    /**
     * Project props was provided via props
     *
     * If true, this means select inputs will be disabled
     */
    isProvidedViaProps: boolean;
}
export declare const ProjectContext: import("react").Context<{
    project: Project;
} | undefined>;
export declare const useProjectContext: () => {
    project: Project;
};
