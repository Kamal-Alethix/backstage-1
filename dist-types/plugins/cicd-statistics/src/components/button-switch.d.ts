/// <reference types="react" />
export interface SwitchValueDetails<T extends string> {
    value: T;
    tooltip?: string;
    text?: string | JSX.Element;
}
export declare type SwitchValue<T extends string> = T | SwitchValueDetails<T>;
export interface ButtonSwitchPropsBase<T extends string> {
    values: ReadonlyArray<SwitchValue<T>>;
    vertical?: boolean;
}
export interface ButtonSwitchPropsSingle<T extends string> extends ButtonSwitchPropsBase<T> {
    multi?: false;
    selection: T;
    onChange: (selected: T) => void;
}
export interface ButtonSwitchPropsMulti<T extends string> extends ButtonSwitchPropsBase<T> {
    multi: true;
    selection: ReadonlyArray<T>;
    onChange: (selected: Array<T>) => void;
}
export declare type ButtonSwitchProps<T extends string> = ButtonSwitchPropsSingle<T> | ButtonSwitchPropsMulti<T>;
export declare function ButtonSwitch<T extends string>(props: ButtonSwitchProps<T>): JSX.Element;
