import React from 'react';
export declare type SidebarPageClassKey = 'root';
/**
 * Props for SidebarPage
 *
 * @public
 */
export declare type SidebarPageProps = {
    children?: React.ReactNode;
};
export declare function SidebarPage(props: SidebarPageProps): JSX.Element;
/**
 * This hook provides a react ref to the main content.
 * Allows to set an element as the main content and focus on that component.
 *
 * *Note: If `contentRef` is not set `focusContent` is noop. `Content` component sets this ref automatically*
 *
 * @public
 * @example
 * Focus current content
 * ```tsx
 *  const { focusContent} = useContent();
 * ...
 *  <Button onClick={focusContent}>
 *     focus main content
 *  </Button>
 * ```
 * @example
 * Set the reference to an Html element
 * ```
 *  const { contentRef } = useContent();
 * ...
 *  <article ref={contentRef} tabIndex={-1}>Main Content</article>
 * ```
 */
export declare function useContent(): {
    focusContent: () => void;
    contentRef: React.MutableRefObject<HTMLElement | null> | undefined;
};
