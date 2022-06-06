import { Entity } from '@backstage/catalog-model';
export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
export declare type PartialEntity = RecursivePartial<Entity>;
