/// <reference types="react" />
export interface TabProps {
    content: any;
    label?: string;
    icon?: any;
}
export interface TabsProps {
    tabs: TabProps[];
}
export declare type TabsClassKey = 'root' | 'styledTabs' | 'appbar';
export declare function Tabs(props: TabsProps): JSX.Element;
