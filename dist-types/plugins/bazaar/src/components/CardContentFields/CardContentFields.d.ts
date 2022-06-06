/// <reference types="react" />
import { GridSize } from '@material-ui/core';
import { Member, BazaarProject } from '../../types';
declare type Props = {
    bazaarProject: BazaarProject;
    members: Member[];
    descriptionSize: GridSize;
    membersSize: GridSize;
};
export declare const CardContentFields: ({ bazaarProject, members, descriptionSize, membersSize, }: Props) => JSX.Element;
export {};
