import { Duration, Maybe, PageFilters } from '../../types';
import { MapFiltersToProps } from '../../hooks/useFilters';
declare type CostOverviewFilterProps = PageFilters & {
    setDuration: (duration: Duration) => void;
    setProject: (project: Maybe<string>) => void;
    setMetric: (metric: Maybe<string>) => void;
};
export declare const mapFiltersToProps: MapFiltersToProps<CostOverviewFilterProps>;
export {};
