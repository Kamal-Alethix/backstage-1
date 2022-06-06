/// <reference types="react" />
/** @public */
export declare type EmptyStateClassKey = 'root' | 'action' | 'imageContainer';
declare type Props = {
    title: string;
    description?: string | JSX.Element;
    missing: 'field' | 'info' | 'content' | 'data';
    action?: JSX.Element;
};
/**
 * Various placeholder views for empty state pages
 *
 * @public
 *
 */
export declare function EmptyState(props: Props): JSX.Element;
export {};
