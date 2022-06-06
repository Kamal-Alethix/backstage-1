/// <reference types="react" />
import { Control, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '../../types';
declare type Props = {
    control: Control<FormValues, object>;
    setValue: UseFormSetValue<FormValues>;
};
export declare const DoubleDateSelector: ({ control, setValue }: Props) => JSX.Element;
export {};
