/// <reference types="react" />
export declare type StructuredMetadataTableListClassKey = 'root';
export declare type StructuredMetadataTableNestedListClassKey = 'root';
declare type Props = {
    metadata: {
        [key: string]: any;
    };
    dense?: boolean;
    options?: any;
};
export declare function StructuredMetadataTable(props: Props): JSX.Element;
export {};
