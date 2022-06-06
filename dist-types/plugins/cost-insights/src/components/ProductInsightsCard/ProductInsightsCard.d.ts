import { PropsWithChildren } from 'react';
import { Duration, Entity, Maybe, Product } from '../../types';
export declare type ProductInsightsCardProps = {
    product: Product;
    initialState: {
        entity: Maybe<Entity>;
        duration: Duration;
    };
    onSelectAsync: (product: Product, duration: Duration) => Promise<Entity>;
};
export declare const ProductInsightsCard: ({ initialState, product, onSelectAsync, }: PropsWithChildren<ProductInsightsCardProps>) => JSX.Element;
