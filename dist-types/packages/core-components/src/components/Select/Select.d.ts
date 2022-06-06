/// <reference types="react" />
/** @public */
export declare type SelectInputBaseClassKey = 'root' | 'input';
/** @public */
export declare type SelectClassKey = 'formControl' | 'label' | 'chips' | 'chip' | 'checkbox' | 'root';
/** @public */
export declare type SelectItem = {
    label: string;
    value: string | number;
};
/** @public */
export declare type SelectedItems = string | string[] | number | number[];
export declare type SelectProps = {
    multiple?: boolean;
    items: SelectItem[];
    label: string;
    placeholder?: string;
    selected?: SelectedItems;
    onChange: (arg: SelectedItems) => void;
    triggerReset?: boolean;
    native?: boolean;
    disabled?: boolean;
};
/** @public */
export declare function SelectComponent(props: SelectProps): JSX.Element;
