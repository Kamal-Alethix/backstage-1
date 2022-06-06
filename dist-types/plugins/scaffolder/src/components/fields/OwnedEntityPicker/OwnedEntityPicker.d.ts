/// <reference types="react" />
import { FieldExtensionComponentProps } from '../../../extensions';
/**
 * The input props that can be specified under `ui:options` for the
 * `OwnedEntityPicker` field extension.
 *
 * @public
 */
export interface OwnedEntityPickerUiOptions {
    allowedKinds?: string[];
    defaultKind?: string;
}
/**
 * The underlying component that is rendered in the form for the `OwnedEntityPicker`
 * field extension.
 *
 * @public
 */
export declare const OwnedEntityPicker: (props: FieldExtensionComponentProps<string, OwnedEntityPickerUiOptions>) => JSX.Element;
