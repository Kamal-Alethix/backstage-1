/// <reference types="react" />
import { FieldExtensionComponentProps } from '../../../extensions';
/**
 * The input props that can be specified under `ui:options` for the
 * `OwnerPicker` field extension.
 *
 * @public
 */
export interface OwnerPickerUiOptions {
    allowedKinds?: string[];
}
/**
 * The underlying component that is rendered in the form for the `OwnerPicker`
 * field extension.
 *
 * @public
 */
export declare const OwnerPicker: (props: FieldExtensionComponentProps<string, OwnerPickerUiOptions>) => JSX.Element;
