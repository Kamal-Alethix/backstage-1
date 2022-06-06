/// <reference types="react" />
import type { Entry, Quadrant, Ring } from '../../utils/types';
export declare type Props = {
    quadrants: Quadrant[];
    rings: Ring[];
    entries: Entry[];
    onEntryMouseEnter?: (entry: Entry) => void;
    onEntryMouseLeave?: (entry: Entry) => void;
};
declare const RadarLegend: (props: Props) => JSX.Element;
export default RadarLegend;
