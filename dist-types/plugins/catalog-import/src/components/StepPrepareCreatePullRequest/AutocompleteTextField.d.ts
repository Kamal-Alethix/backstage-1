import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import React from 'react';
import { Controller, FieldErrors } from 'react-hook-form';
/**
 * Props for {@link AutocompleteTextField}.
 *
 * @public
 */
export interface AutocompleteTextFieldProps<TFieldValue extends string> {
    name: TFieldValue;
    options: string[];
    required?: boolean;
    errors?: FieldErrors;
    rules?: React.ComponentProps<typeof Controller>['rules'];
    loading?: boolean;
    loadingText?: string;
    helperText?: React.ReactNode;
    errorHelperText?: string;
    textFieldProps?: Omit<TextFieldProps, 'required' | 'fullWidth'>;
}
/**
 * An autocompletion text field for the catalog import flows.
 *
 * @public
 */
export declare const AutocompleteTextField: <TFieldValue extends string>(props: AutocompleteTextFieldProps<TFieldValue>) => JSX.Element;
