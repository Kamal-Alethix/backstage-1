/// <reference types="react" />
import { Project } from '../../../../api/JenkinsApi';
declare type Props = {
    loading: boolean;
    retry: () => void;
    projects?: Project[];
    page: number;
    onChangePage: (page: number) => void;
    total: number;
    pageSize: number;
    onChangePageSize: (pageSize: number) => void;
};
export declare const CITableView: ({ loading, pageSize, page, retry, projects, onChangePage, onChangePageSize, total, }: Props) => JSX.Element;
export declare const CITable: () => JSX.Element;
export {};
