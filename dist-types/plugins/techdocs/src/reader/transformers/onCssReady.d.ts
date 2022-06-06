import type { Transformer } from './transformer';
declare type OnCssReadyOptions = {
    onLoading: () => void;
    onLoaded: () => void;
};
export declare const onCssReady: ({ onLoading, onLoaded, }: OnCssReadyOptions) => Transformer;
export {};
