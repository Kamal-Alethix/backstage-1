/// <reference types="react" />
import type { Quadrant, Ring, Entry } from '../../utils/types';
export declare type Props = {
    width: number;
    height: number;
    radius: number;
    rings: Ring[];
    quadrants: Quadrant[];
    entries: Entry[];
    activeEntry?: Entry;
    onEntryMouseEnter?: (entry: Entry) => void;
    onEntryMouseLeave?: (entry: Entry) => void;
};
declare const RadarPlot: (props: Props) => JSX.Element;
export default RadarPlot;
