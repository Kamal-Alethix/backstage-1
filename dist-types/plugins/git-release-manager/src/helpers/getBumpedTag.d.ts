import { CalverTagParts } from './tagParts/getCalverTagParts';
import { Project } from '../contexts/ProjectContext';
import { SEMVER_PARTS } from '../constants/constants';
import { SemverTagParts } from './tagParts/getSemverTagParts';
/**
 * Calculates the next version for the project
 *
 * For calendar versioning this means a bump in patch
 *
 * For semantic versioning this means either a minor or a patch bump
 * depending on the value of `bumpLevel`
 */
export declare function getBumpedTag({ project, tag, bumpLevel, }: {
    project: Project;
    tag: string;
    bumpLevel: keyof typeof SEMVER_PARTS;
}): {
    bumpedTag: string;
    tagParts: CalverTagParts;
    error: undefined;
} | {
    bumpedTag: string;
    tagParts: {
        prefix: string;
        major: number;
        minor: number;
        patch: number;
    };
    error: undefined;
} | {
    error: import("../types/types").AlertError;
};
/**
 * Calculates the next semantic version, taking into account
 * whether or not it's a minor or patch
 */
export declare function getBumpedSemverTagParts(tagParts: SemverTagParts, semverBumpLevel: keyof typeof SEMVER_PARTS): {
    bumpedTagParts: {
        prefix: string;
        major: number;
        minor: number;
        patch: number;
    };
};
