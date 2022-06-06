import React from 'react';
import { CustomFieldValidator, FieldExtensionOptions, FieldExtensionComponentProps } from './types';
import { Extension } from '@backstage/core-plugin-api';
export declare const FIELD_EXTENSION_WRAPPER_KEY = "scaffolder.extensions.wrapper.v1";
export declare const FIELD_EXTENSION_KEY = "scaffolder.extensions.field.v1";
/**
 * A type used to wrap up the FieldExtension to embed the ReturnValue and the InputProps
 *
 * @public
 */
export declare type FieldExtensionComponent<_TReturnValue, _TInputProps> = () => null;
/**
 * Method for creating field extensions that can be used in the scaffolder
 * frontend form.
 * @public
 */
export declare function createScaffolderFieldExtension<TReturnValue = unknown, TInputProps = unknown>(options: FieldExtensionOptions<TReturnValue, TInputProps>): Extension<FieldExtensionComponent<TReturnValue, TInputProps>>;
/**
 * The Wrapping component for defining fields extensions inside
 *
 * @public
 */
export declare const ScaffolderFieldExtensions: React.ComponentType;
export type { CustomFieldValidator, FieldExtensionOptions, FieldExtensionComponentProps, };
export { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from './default';
