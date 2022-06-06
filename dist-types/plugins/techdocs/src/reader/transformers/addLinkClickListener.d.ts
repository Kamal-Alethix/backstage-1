import type { Transformer } from './transformer';
declare type AddLinkClickListenerOptions = {
    baseUrl: string;
    onClick: (e: MouseEvent, newUrl: string) => void;
};
export declare const addLinkClickListener: ({ baseUrl, onClick, }: AddLinkClickListenerOptions) => Transformer;
export {};
