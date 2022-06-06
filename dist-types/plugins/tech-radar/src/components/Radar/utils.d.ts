import type { Ring, Quadrant, Entry } from '../../utils/types';
export declare const adjustQuadrants: (quadrants: Quadrant[], radius: number, width: number, height: number) => void;
export declare const adjustEntries: (entries: Entry[], quadrants: Quadrant[], rings: Ring[], radius: number, activeEntry?: Entry | undefined) => void;
export declare const adjustRings: (rings: Ring[], radius: number) => void;
