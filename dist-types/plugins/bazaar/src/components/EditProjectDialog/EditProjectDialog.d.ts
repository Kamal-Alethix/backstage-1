/// <reference types="react" />
import { BazaarProject } from '../../types';
declare type Props = {
    bazaarProject: BazaarProject;
    openEdit: boolean;
    handleEditClose: () => void;
    handleCardClose?: () => void;
    fetchBazaarProject: () => Promise<BazaarProject | null>;
};
export declare const EditProjectDialog: ({ bazaarProject, openEdit, handleEditClose, handleCardClose, fetchBazaarProject, }: Props) => JSX.Element;
export {};
