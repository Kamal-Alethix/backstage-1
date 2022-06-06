interface PrimitiveMap {
    [name: string]: number | string | boolean;
}
export declare const buildQuery: (obj: PrimitiveMap) => string;
export {};
