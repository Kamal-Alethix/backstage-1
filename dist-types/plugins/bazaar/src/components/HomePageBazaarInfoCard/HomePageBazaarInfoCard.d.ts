/// <reference types="react" />
import { BazaarProject } from '../../types';
import { Entity } from '@backstage/catalog-model';
declare type Props = {
    initProject: BazaarProject;
    handleClose: () => void;
    initEntity: Entity;
};
export declare const HomePageBazaarInfoCard: ({ initProject, handleClose, initEntity, }: Props) => JSX.Element;
export {};
