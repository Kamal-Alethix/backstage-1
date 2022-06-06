/// <reference types="react" />
interface StyledTabProps {
    label?: string;
    icon?: any;
    isFirstNav?: boolean;
    isFirstIndex?: boolean;
    value?: any;
}
/** @public */
export declare type TabClassKey = 'root' | 'selected';
export declare const StyledTab: (props: StyledTabProps) => JSX.Element;
export {};
