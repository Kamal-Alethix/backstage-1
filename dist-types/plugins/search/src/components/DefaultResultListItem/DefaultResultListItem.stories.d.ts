import React from 'react';
declare const _default: {
    title: string;
    component: ({ result, highlight, icon, secondaryAction, lineClamp, }: {
        icon?: React.ReactNode;
        secondaryAction?: React.ReactNode;
        result: import("@backstage/plugin-search-common").SearchDocument;
        highlight?: import("@backstage/plugin-search-common").ResultHighlight | undefined;
        lineClamp?: number | undefined;
    }) => JSX.Element;
    decorators: ((Story: () => JSX.Element) => JSX.Element)[];
};
export default _default;
export declare const Default: () => JSX.Element;
export declare const WithIcon: () => JSX.Element;
export declare const WithSecondaryAction: () => JSX.Element;
export declare const WithHighlightedResults: () => JSX.Element;
export declare const WithCustomHighlightedResults: () => JSX.Element;
