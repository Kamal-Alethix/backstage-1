import { PropsWithChildren } from 'react';
import type { Epoch } from './types';
interface ZoomState {
    left?: number;
    right?: number;
}
export declare function ZoomProvider({ children }: PropsWithChildren<{}>): JSX.Element;
export declare function useZoom(): {
    resetZoom: () => void;
    zoomState: ZoomState;
    zoomFilterValues: <T extends Epoch>(values: T[]) => T[];
};
export interface ZoomAreaProps {
    yAxisId?: number | string | undefined;
}
export declare function useZoomArea(): {
    zoomProps: {
        onMouseDown: (e: any) => void;
        onMouseMove: (e: any) => void;
        onMouseUp: () => void;
    };
    getZoomArea: (props?: ZoomAreaProps | undefined) => JSX.Element;
};
export {};
