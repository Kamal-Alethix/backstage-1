/// <reference types="react" />
import { GridSize } from '@material-ui/core';
interface DataValueProps {
    field: string;
    value?: string | number | null | undefined;
}
export declare const DataValue: ({ field, value }: DataValueProps) => JSX.Element;
interface GridProps {
    xs?: GridSize;
    md?: GridSize;
    lg?: GridSize;
}
export declare const DataValueGridItem: (props: DataValueProps & GridProps) => JSX.Element;
export {};
