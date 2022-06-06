import { MapFiltersToProps } from '../../hooks/useFilters';
import { MapLoadingToProps } from '../../hooks/useLoading';
import { Duration, PageFilters, ProductPeriod } from '../../types';
declare type ProductInsightsCardFilterProps = PageFilters & {
    product: ProductPeriod;
    setProduct: (duration: Duration) => void;
};
declare type ProductInsightsCardLoadingProps = {
    loadingProduct: boolean;
    dispatchLoading: (isLoading: boolean) => void;
};
export declare const mapFiltersToProps: (product: string) => MapFiltersToProps<ProductInsightsCardFilterProps>;
export declare const mapLoadingToProps: (product: string) => MapLoadingToProps<ProductInsightsCardLoadingProps>;
export {};
