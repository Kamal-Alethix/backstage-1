/// <reference types="react" />
import { Control, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '../../types';
declare type Props = {
    name: 'startDate' | 'endDate';
    control: Control<FormValues, object>;
    setValue: UseFormSetValue<FormValues>;
};
export declare const DateSelector: ({ name, control, setValue }: Props) => JSX.Element;
export {};
