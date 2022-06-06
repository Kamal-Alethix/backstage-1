/// <reference types="react" />
import { BazaarProject } from '../../types';
import { Entity } from '@backstage/catalog-model';
declare type Props = {
    project: BazaarProject;
    fetchBazaarProjects: () => Promise<BazaarProject[]>;
    catalogEntities: Entity[];
};
export declare const ProjectCard: ({ project, fetchBazaarProjects, catalogEntities, }: Props) => JSX.Element;
export {};
