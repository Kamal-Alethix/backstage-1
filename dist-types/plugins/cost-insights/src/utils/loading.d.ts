import { Duration, Entity, Loading, Maybe, Product } from '../types';
export declare type ProductState = {
    product: Product;
    entity: Maybe<Entity>;
    duration: Duration;
};
export declare enum DefaultLoadingAction {
    UserGroups = "user-groups",
    LastCompleteBillingDate = "billing-date",
    CostInsightsInitial = "cost-insights-initial",
    CostInsightsPage = "cost-insights-page",
    CostInsightsProducts = "cost-insights-products",
    CostInsightsAlerts = "cost-insights-alerts"
}
export declare const INITIAL_LOADING_ACTIONS: DefaultLoadingAction[];
export declare const getDefaultState: (loadingActions: string[]) => Loading;
export declare const getResetState: (loadingActions: string[]) => Loading;
export declare const getResetStateWithoutInitial: (loadingActions: string[]) => Loading;
export declare const settledResponseOf: (responses: PromiseSettledResult<Entity | any>[]) => Array<Maybe<Entity>>;
export declare const initialStatesOf: (products: Product[], responses: Array<Maybe<Entity>>) => ProductState[];
