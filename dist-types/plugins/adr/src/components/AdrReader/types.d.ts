/**
 * ADR content decorator function type. Decorators are responsible for
 * performing any necessary transformations on the ADR content before rendering.
 * @public
 */
export declare type AdrContentDecorator = (adrInfo: {
    baseUrl: string;
    content: string;
}) => {
    content: string;
};
