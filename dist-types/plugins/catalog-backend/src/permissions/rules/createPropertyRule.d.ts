import { Entity } from '@backstage/catalog-model';
export declare const createPropertyRule: (propertyType: 'metadata' | 'spec') => import("@backstage/plugin-permission-node").PermissionRule<Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
