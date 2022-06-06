/// <reference types="react" />
import type { Ring, Quadrant, Entry } from '../../utils/types';
export declare type Props = {
    width: number;
    height: number;
    quadrants: Quadrant[];
    rings: Ring[];
    entries: Entry[];
    svgProps?: object;
};
declare const Radar: (props: Props) => JSX.Element;
export default Radar;
