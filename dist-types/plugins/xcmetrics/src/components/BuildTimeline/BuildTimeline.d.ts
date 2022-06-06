/// <reference types="react" />
import { Target } from '../../api';
export interface BuildTimelineProps {
    targets: Target[];
    height?: number;
    width?: number;
}
export declare const BuildTimeline: ({ targets, height, width, }: BuildTimelineProps) => JSX.Element;
