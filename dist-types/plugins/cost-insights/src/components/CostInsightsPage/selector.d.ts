import { MapLoadingToProps } from '../../hooks';
declare type CostInsightsPageLoadingProps = {
    loadingActions: Array<string>;
    loadingGroups: boolean;
    loadingBillingDate: boolean;
    loadingInitial: boolean;
    dispatchInitial: (isLoading: boolean) => void;
    dispatchInsights: (isLoading: boolean) => void;
    dispatchNone: (loadingActions: string[]) => void;
    dispatchReset: (loadingActions: string[]) => void;
};
export declare const mapLoadingToProps: MapLoadingToProps<CostInsightsPageLoadingProps>;
export {};
