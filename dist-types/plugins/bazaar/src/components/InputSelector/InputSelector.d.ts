/// <reference types="react" />
import { Control, FieldError } from 'react-hook-form';
import { FormValues } from '../../types';
declare type Props = {
    options: string[];
    control: Control<FormValues, object>;
    name: 'status' | 'size';
    error?: FieldError | undefined;
};
export declare const InputSelector: ({ name, options, control, error }: Props) => JSX.Element;
export {};
