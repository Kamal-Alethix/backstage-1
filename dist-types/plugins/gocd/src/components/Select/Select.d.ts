/// <reference types="react" />
export declare type Item = {
    label: string;
    value: string | number;
};
declare type SelectComponentProps = {
    value: string;
    items: Item[];
    label: string;
    onChange: (value: string) => void;
};
export declare const SelectComponent: ({ value, items, label, onChange, }: SelectComponentProps) => JSX.Element;
export {};
