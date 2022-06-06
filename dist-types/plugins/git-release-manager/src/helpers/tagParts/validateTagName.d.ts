import { Project } from '../../contexts/ProjectContext';
export declare const validateTagName: ({ project, tagName, }: {
    project: Project;
    tagName?: string | undefined;
}) => {
    tagNameError: null;
} | {
    tagNameError: import("../../types/types").AlertError | undefined;
};
