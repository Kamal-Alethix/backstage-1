/// <reference types="react" />
import { ColumnBreakpoints } from './types';
import { IconComponent } from '@backstage/core-plugin-api';
export interface LinksGridListItem {
    href: string;
    text?: string;
    Icon?: IconComponent;
}
interface LinksGridListProps {
    items: LinksGridListItem[];
    cols?: ColumnBreakpoints | number;
}
export declare function LinksGridList(props: LinksGridListProps): JSX.Element;
export {};
