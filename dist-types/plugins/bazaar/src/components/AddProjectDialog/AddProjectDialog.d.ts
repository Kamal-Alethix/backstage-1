/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { BazaarProject } from '../../types';
declare type Props = {
    catalogEntities: Entity[];
    open: boolean;
    handleClose: () => void;
    fetchBazaarProjects: () => Promise<BazaarProject[]>;
    fetchCatalogEntities: () => Promise<Entity[]>;
};
export declare const AddProjectDialog: ({ catalogEntities, open, handleClose, fetchBazaarProjects, fetchCatalogEntities, }: Props) => JSX.Element;
export {};
