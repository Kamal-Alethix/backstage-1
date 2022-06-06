/// <reference types="react" />
import { Maybe, Product } from '../../types';
declare type ProductInsightsProps = {
    group: string;
    project: Maybe<string>;
    products: Product[];
    onLoaded: (entities: Product[]) => void;
};
export declare const ProductInsights: ({ group, project, products, onLoaded, }: ProductInsightsProps) => JSX.Element;
export {};
