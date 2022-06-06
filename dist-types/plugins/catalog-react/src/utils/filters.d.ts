import { Entity } from '@backstage/catalog-model';
import { EntityFilter } from '../types';
export declare function reduceCatalogFilters(filters: EntityFilter[]): Record<string, string | symbol | (string | symbol)[]>;
export declare function reduceEntityFilters(filters: EntityFilter[]): (entity: Entity) => boolean;
