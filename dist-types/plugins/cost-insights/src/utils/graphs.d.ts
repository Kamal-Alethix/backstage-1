import { TooltipPayload, TooltipProps } from 'recharts';
import { AlertCost, Entity, ResourceData } from '../types';
export declare function formatGraphValue(value: number, format?: string): string;
export declare const overviewGraphTickFormatter: (millis: string | number) => string;
export declare const tooltipItemOf: (payload: TooltipPayload) => {
    label: string;
    value: string;
    fill: string;
} | null;
export declare const resourceOf: (entity: Entity | AlertCost) => ResourceData;
export declare const titleOf: (label?: string | number | undefined) => string;
export declare const isInvalid: ({ label, payload }: TooltipProps) => boolean;
export declare const isLabeled: (data?: Record<"activeLabel", string | undefined> | undefined) => boolean | "" | undefined;
export declare const isUnlabeled: (data?: Record<"activeLabel", string | undefined> | undefined) => boolean;
