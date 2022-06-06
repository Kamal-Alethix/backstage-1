import { Entity } from '@backstage/catalog-model';
import { RollbarTopActiveItem } from '../api/types';
export declare function useTopActiveItems(entity: Entity): {
    items: RollbarTopActiveItem[];
    organization: string;
    project: string;
    loading: boolean;
    error: Error | undefined;
};
