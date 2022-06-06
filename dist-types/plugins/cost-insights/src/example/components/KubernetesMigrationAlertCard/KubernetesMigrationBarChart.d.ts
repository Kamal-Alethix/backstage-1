/// <reference types="react" />
import { Entity } from '../../../types';
declare type MigrationBarChartProps = {
    currentProduct: string;
    comparedProduct: string;
    services: Array<Entity>;
};
export declare const KubernetesMigrationBarChart: ({ currentProduct, comparedProduct, services, }: MigrationBarChartProps) => JSX.Element;
export {};
