/// <reference types="react" />
import { RollbarTopActiveItem } from '../../api/types';
declare type Props = {
    items: RollbarTopActiveItem[];
    organization: string;
    project: string;
    loading: boolean;
    error?: any;
};
export declare const RollbarTopItemsTable: ({ items, organization, project, loading, error, }: Props) => JSX.Element;
export {};
