/// <reference types="react" />
import { BazaarProject } from '../../types';
import { Entity } from '@backstage/catalog-model';
declare type Props = {
    bazaarProjects: BazaarProject[];
    fetchBazaarProjects: () => Promise<BazaarProject[]>;
    catalogEntities: Entity[];
};
export declare const ProjectPreview: ({ bazaarProjects, fetchBazaarProjects, catalogEntities, }: Props) => JSX.Element;
export {};
