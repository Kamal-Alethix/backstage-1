/// <reference types="react" />
import { CicdDefaults } from '../apis/types';
import { ChartableStage } from './types';
export interface StageChartProps {
    stage: ChartableStage;
    chartTypes: CicdDefaults['chartTypes'];
    defaultCollapsed?: number;
    defaultHidden?: number;
    zeroYAxis?: boolean;
}
export declare function StageChart(props: StageChartProps): JSX.Element | null;
