/// <reference types="react" />
import { ChangeStatistic } from '../../../types';
export declare type MigrationBarChartLegendProps = {
    change: ChangeStatistic;
    startDate: string;
    currentProduct: string;
    comparedProduct: string;
};
export declare const KubernetesMigrationBarChartLegend: ({ currentProduct, comparedProduct, change, startDate, }: MigrationBarChartLegendProps) => JSX.Element;
