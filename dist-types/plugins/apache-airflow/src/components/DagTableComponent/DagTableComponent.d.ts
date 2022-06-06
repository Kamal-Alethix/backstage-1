/// <reference types="react" />
import { Dag } from '../../api/types';
declare type DenseTableProps = {
    dags: Dag[];
};
export declare const DenseTable: ({ dags }: DenseTableProps) => JSX.Element;
export declare const DagTableComponent: () => JSX.Element;
export {};
