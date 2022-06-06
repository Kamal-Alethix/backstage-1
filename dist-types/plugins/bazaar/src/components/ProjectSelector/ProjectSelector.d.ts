/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
declare type Props = {
    catalogEntities: Entity[];
    onChange: (entity: Entity) => void;
    disableClearable: boolean;
    defaultValue: Entity | null | undefined;
    label: string;
};
export declare const ProjectSelector: ({ catalogEntities, onChange, disableClearable, defaultValue, label, }: Props) => JSX.Element;
export {};
