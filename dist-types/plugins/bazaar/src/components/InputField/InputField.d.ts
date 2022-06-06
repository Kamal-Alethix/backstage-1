/// <reference types="react" />
import { Control, FieldError, ValidationRule } from 'react-hook-form';
import { FormValues } from '../../types';
declare type Rules = {
    required: boolean;
    pattern?: ValidationRule<RegExp> | undefined;
};
declare type Props = {
    inputType: 'description' | 'community' | 'responsible' | 'name';
    error?: FieldError | undefined;
    control: Control<FormValues, object>;
    helperText?: string;
    placeholder?: string;
    rules?: Rules | undefined;
};
export declare const InputField: ({ inputType, error, control, helperText, placeholder, rules, }: Props) => JSX.Element;
export {};
