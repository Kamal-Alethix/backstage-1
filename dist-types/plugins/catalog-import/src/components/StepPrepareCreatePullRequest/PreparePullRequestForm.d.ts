import React from 'react';
import { SubmitHandler, UnpackNestedValue, UseFormProps, UseFormReturn } from 'react-hook-form';
/**
 * Props for {@link PreparePullRequestForm}.
 *
 * @public
 */
export declare type PreparePullRequestFormProps<TFieldValues extends Record<string, any>> = Pick<UseFormProps<TFieldValues>, 'defaultValues'> & {
    onSubmit: SubmitHandler<TFieldValues>;
    render: (props: Pick<UseFormReturn<TFieldValues>, 'formState' | 'register' | 'control' | 'setValue'> & {
        values: UnpackNestedValue<TFieldValues>;
    }) => React.ReactNode;
};
/**
 * A form wrapper that creates a form that is used to prepare a pull request. It
 * hosts the form logic.
 *
 * @param defaultValues - the default values of the form
 * @param onSubmit - a callback that is executed when the form is submitted
 *   (initiated by a button of type="submit")
 * @param render - render the form elements
 * @public
 */
export declare const PreparePullRequestForm: <TFieldValues extends Record<string, any>>(props: PreparePullRequestFormProps<TFieldValues>) => JSX.Element;
