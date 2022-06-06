/// <reference types="react" />
import { BarChartOptions, Entity } from '../../types';
export declare type ProductEntityTableOptions = Partial<Pick<BarChartOptions, 'previousName' | 'currentName'>>;
declare type ProductEntityTableProps = {
    entityLabel: string;
    entity: Entity;
    options: ProductEntityTableOptions;
};
export declare const ProductEntityTable: ({ entityLabel, entity, options, }: ProductEntityTableProps) => JSX.Element;
export {};
