/// <reference types="react" />
declare type Props = {
    missing: 'field' | 'info' | 'content' | 'data';
};
/** @public */
export declare type EmptyStateImageClassKey = 'generalImg';
/** @public */
export declare const EmptyStateImage: ({ missing }: Props) => JSX.Element | null;
export {};
