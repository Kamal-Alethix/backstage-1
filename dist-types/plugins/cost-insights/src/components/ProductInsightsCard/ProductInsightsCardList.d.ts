/// <reference types="react" />
import { Duration, Entity, Product } from '../../types';
import { ProductState } from '../../utils/loading';
declare type ProductInsightsCardListProps = {
    initialStates: ProductState[];
    onSelectAsync: (product: Product, duration: Duration) => Promise<Entity>;
};
export declare const ProductInsightsCardList: ({ initialStates, onSelectAsync, }: ProductInsightsCardListProps) => JSX.Element;
export {};
