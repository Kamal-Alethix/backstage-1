/// <reference types="react" />
import { Maybe, Project } from '../../types';
declare type ProjectSelectProps = {
    project: Maybe<string>;
    projects: Array<Project>;
    onSelect: (project: Maybe<string>) => void;
};
export declare const ProjectSelect: ({ project, projects, onSelect, }: ProjectSelectProps) => JSX.Element;
export {};
