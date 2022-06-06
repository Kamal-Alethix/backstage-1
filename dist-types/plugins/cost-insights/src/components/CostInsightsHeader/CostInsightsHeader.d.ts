/// <reference types="react" />
import { Group } from '../../types';
declare type CostInsightsHeaderProps = {
    owner: string;
    groups: Group[];
    hasCostData: boolean;
    alerts: number;
};
export declare const CostInsightsHeaderNoGroups: () => JSX.Element;
export declare const CostInsightsHeader: (props: CostInsightsHeaderProps) => JSX.Element;
export {};
