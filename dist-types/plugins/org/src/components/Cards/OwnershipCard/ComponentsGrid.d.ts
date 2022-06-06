/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
export declare const ComponentsGrid: ({ entity, relationsType, isGroup, entityFilterKind, }: {
    entity: Entity;
    relationsType: string;
    isGroup: boolean;
    entityFilterKind?: string[] | undefined;
}) => JSX.Element;
