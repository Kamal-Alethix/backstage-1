import { ReactNode } from 'react';
import { ResultHighlight, SearchDocument } from '@backstage/plugin-search-common';
declare type Props = {
    icon?: ReactNode;
    secondaryAction?: ReactNode;
    result: SearchDocument;
    highlight?: ResultHighlight;
    lineClamp?: number;
};
export declare const DefaultResultListItem: ({ result, highlight, icon, secondaryAction, lineClamp, }: Props) => JSX.Element;
export {};
