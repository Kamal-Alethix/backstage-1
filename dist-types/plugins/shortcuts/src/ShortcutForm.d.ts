/// <reference types="react" />
import { SubmitHandler } from 'react-hook-form';
import { FormValues } from './types';
declare type Props = {
    formValues?: FormValues;
    onSave: SubmitHandler<FormValues>;
    onClose: () => void;
};
export declare const ShortcutForm: ({ formValues, onSave, onClose }: Props) => JSX.Element;
export {};
