/// <reference types="react" />
declare type TabType = {
    label: string;
    Component: () => JSX.Element;
};
export declare const ComponentTabs: (props: {
    title: string;
    tabs: TabType[];
}) => JSX.Element;
export {};
