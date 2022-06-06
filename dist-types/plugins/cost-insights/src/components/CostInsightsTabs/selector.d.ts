import { MapFiltersToProps } from '../../hooks/useFilters';
import { MapLoadingToProps } from '../../hooks/useLoading';
import { Group, PageFilters } from '../../types';
declare type CostInsightsTabsFilterProps = PageFilters & {
    setGroup: (group: Group) => void;
};
declare type CostInsightsTabsLoadingProps = {
    loadingActions: Array<string>;
    dispatchReset: (loadingActions: string[]) => void;
};
export declare const mapFiltersToProps: MapFiltersToProps<CostInsightsTabsFilterProps>;
export declare const mapLoadingToProps: MapLoadingToProps<CostInsightsTabsLoadingProps>;
export {};
