/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { BazaarProject } from '../../types';
declare type Props = {
    openProjectSelector: boolean;
    handleProjectSelectorClose: () => void;
    catalogEntities: Entity[];
    bazaarProject: BazaarProject;
    fetchBazaarProject: () => Promise<BazaarProject | null>;
    initEntity: Entity;
};
export declare const LinkProjectDialog: ({ openProjectSelector, handleProjectSelectorClose, catalogEntities, bazaarProject, fetchBazaarProject, initEntity, }: Props) => JSX.Element;
export {};
