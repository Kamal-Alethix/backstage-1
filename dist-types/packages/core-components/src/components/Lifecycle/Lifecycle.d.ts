/// <reference types="react" />
import CSS from 'csstype';
declare type Props = CSS.Properties & {
    shorthand?: boolean;
    alpha?: boolean;
};
export declare type LifecycleClassKey = 'alpha' | 'beta';
export declare function Lifecycle(props: Props): JSX.Element;
export {};
