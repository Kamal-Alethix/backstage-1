/// <reference types="react" />
import { InputProps } from '@material-ui/core';
interface DatePickerProps {
    label: string;
    onDateChange?: (date: string) => void;
}
export declare const DatePicker: ({ label, onDateChange, ...inputProps }: InputProps & DatePickerProps) => JSX.Element;
export {};
