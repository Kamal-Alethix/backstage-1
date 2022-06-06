/// <reference types="react" />
import { BazaarProject } from '../../types';
declare type Props = {
    bazaarProject: BazaarProject | null | undefined;
    fetchBazaarProject: () => Promise<BazaarProject | null>;
};
export declare const EntityBazaarInfoContent: ({ bazaarProject, fetchBazaarProject, }: Props) => JSX.Element | null;
export {};
