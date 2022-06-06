import React from 'react';
import { WithStyles } from '@material-ui/core/styles';
export declare type MetadataTableTitleCellClassKey = 'root';
export declare type MetadataTableCellClassKey = 'root';
export declare type MetadataTableListClassKey = 'root';
export declare type MetadataTableListItemClassKey = 'root' | 'random';
export declare const MetadataTable: ({ dense, children, }: {
    dense?: boolean | undefined;
    children: React.ReactNode;
}) => JSX.Element;
export declare const MetadataTableItem: ({ title, children, ...rest }: {
    title: string;
    children: React.ReactNode;
}) => JSX.Element;
interface StyleProps extends WithStyles {
    children?: React.ReactNode;
}
export declare const MetadataList: React.ComponentType<Pick<StyleProps, "children"> & import("@material-ui/core/styles").StyledComponentProps<"root">>;
export declare const MetadataListItem: React.ComponentType<Pick<StyleProps, "children"> & import("@material-ui/core/styles").StyledComponentProps<"root" | "random">>;
export {};
