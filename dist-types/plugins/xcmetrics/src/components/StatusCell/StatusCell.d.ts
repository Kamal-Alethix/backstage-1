/// <reference types="react" />
import { BuildStatusResult } from '../../api';
interface StatusCellProps {
    buildStatus?: BuildStatusResult;
    size: number;
    spacing: number;
}
export declare const StatusCell: (props: StatusCellProps) => JSX.Element;
export {};
