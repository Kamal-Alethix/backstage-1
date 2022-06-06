/// <reference types="react" />
import { ApiHolder } from '@backstage/core-plugin-api';
import { FieldValidation, FieldProps } from '@rjsf/core';
/**
 * Field validation type for Custom Field Extensions.
 *
 * @public
 */
export declare type CustomFieldValidator<TFieldReturnValue> = (data: TFieldReturnValue, field: FieldValidation, context: {
    apiHolder: ApiHolder;
}) => void;
/**
 * Type for the Custom Field Extension with the
 * name and components and validation function.
 *
 * @public
 */
export declare type FieldExtensionOptions<TFieldReturnValue = unknown, TInputProps = unknown> = {
    name: string;
    component: (props: FieldExtensionComponentProps<TFieldReturnValue, TInputProps>) => JSX.Element | null;
    validation?: CustomFieldValidator<TFieldReturnValue>;
};
/**
 * Type for field extensions and being able to type
 * incoming props easier.
 *
 * @public
 */
export interface FieldExtensionComponentProps<TFieldReturnValue, TUiOptions extends {} = {}> extends FieldProps<TFieldReturnValue> {
    uiSchema: FieldProps['uiSchema'] & {
        'ui:options'?: TUiOptions;
    };
}
