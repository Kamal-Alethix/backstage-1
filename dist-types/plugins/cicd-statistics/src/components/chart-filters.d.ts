/// <reference types="react" />
import { CicdConfiguration, CicdDefaults, FilterBranchType, FilterStatusType } from '../apis/types';
import { ChartableStagesAnalysis } from '../charts/types';
export declare const useStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare type BranchSelection = FilterBranchType | 'all';
export declare type StatusSelection = FilterStatusType;
export interface ChartFilter {
    fromDate: Date;
    toDate: Date;
    branch: string;
    status: Array<string>;
}
export declare function getDefaultChartFilter(cicdConfiguration: CicdConfiguration): ChartFilter;
export declare type ViewOptions = Pick<CicdDefaults, 'lowercaseNames' | 'normalizeTimeRange' | 'collapsedLimit' | 'hideLimit' | 'chartTypes'>;
export declare function getDefaultViewOptions(cicdConfiguration: CicdConfiguration): ViewOptions;
export interface ChartFiltersProps {
    analysis?: ChartableStagesAnalysis;
    cicdConfiguration: CicdConfiguration;
    initialFetchFilter: ChartFilter;
    currentFetchFilter?: ChartFilter;
    onChangeFetchFilter(filter: ChartFilter): void;
    updateFetchFilter(filter: ChartFilter): void;
    initialViewOptions: ViewOptions;
    onChangeViewOptions(filter: ViewOptions): void;
}
export declare function ChartFilters(props: ChartFiltersProps): JSX.Element;
