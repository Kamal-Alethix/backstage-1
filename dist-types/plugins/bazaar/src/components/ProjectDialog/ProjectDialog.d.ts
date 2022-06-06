/// <reference types="react" />
import { UseFormReset, UseFormGetValues } from 'react-hook-form';
import { FormValues } from '../../types';
declare type Props = {
    handleSave: (getValues: UseFormGetValues<FormValues>, reset: UseFormReset<FormValues>) => Promise<void>;
    isAddForm: boolean;
    title: string;
    defaultValues: FormValues;
    open: boolean;
    projectSelector?: JSX.Element;
    deleteButton?: JSX.Element;
    handleClose: () => void;
};
export declare const ProjectDialog: ({ handleSave, isAddForm, title, defaultValues, open, projectSelector, deleteButton, handleClose, }: Props) => JSX.Element;
export {};
