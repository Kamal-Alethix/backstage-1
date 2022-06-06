/// <reference types="react" />
import { ClusterStatus } from '../../api';
declare type ClusterTableProps = {
    components: ClusterStatus[];
};
declare const ClusterTable: ({ components }: ClusterTableProps) => JSX.Element;
export default ClusterTable;
