import { Project } from '../../contexts/ProjectContext';
/**
 * Tag parts are the individual parts of a version, e.g. <major>.<minor>.<patch>
 * are the parts of a semantic version
 */
export declare function getTagParts({ project, tag, }: {
    project: Project;
    tag: string;
}): {
    error: import("../../types/types").AlertError;
    tagParts?: undefined;
} | {
    tagParts: import("./getCalverTagParts").CalverTagParts;
    error?: undefined;
} | {
    tagParts: import("./getSemverTagParts").SemverTagParts;
    error?: undefined;
};
