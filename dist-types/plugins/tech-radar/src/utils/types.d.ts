import { MovedState } from '../api';
export declare type Ring = {
    id: string;
    index?: number;
    name: string;
    color: string;
    outerRadius?: number;
    innerRadius?: number;
};
export declare type Quadrant = {
    id: string;
    index?: number;
    name: string;
    legendX?: number;
    legendY?: number;
    legendWidth?: number;
    legendHeight?: number;
    radialMin?: number;
    radialMax?: number;
    offsetX?: number;
    offsetY?: number;
};
export declare type Segment = {
    clipx: Function;
    clipy: Function;
    random: Function;
};
export declare type Entry = {
    id: string;
    index?: number;
    x?: number;
    y?: number;
    color?: string;
    segment?: Segment;
    quadrant: Quadrant;
    ring: Ring;
    title: string;
    url?: string;
    moved?: MovedState;
    description?: string;
    active?: boolean;
    timeline?: Array<EntrySnapshot>;
};
export declare type EntrySnapshot = {
    date: Date;
    ring: Ring;
    description?: string;
    moved?: MovedState;
};
export declare type DeclaredEntry = Entry & {
    quadrant: string;
    ring: string;
};
