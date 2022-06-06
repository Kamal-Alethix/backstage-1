/// <reference types="react" />
import { ScrollTo } from '../hooks/useScroll';
export interface ScrollAnchorProps extends ScrollIntoViewOptions {
    id: ScrollTo;
    top?: number;
    left?: number;
}
export declare const ScrollAnchor: ({ id, left, top, block, inline, behavior, }: ScrollAnchorProps) => JSX.Element;
