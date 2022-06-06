/// <reference types="react" />
import { FieldExtensionComponentProps } from '../../../extensions';
/**
 * The input props that can be specified under `ui:options` for the
 * `EntityPicker` field extension.
 *
 * @public
 */
export interface EntityPickerUiOptions {
    allowedKinds?: string[];
    defaultKind?: string;
    allowArbitraryValues?: boolean;
}
/**
 * The underlying component that is rendered in the form for the `EntityPicker`
 * field extension.
 *
 * @public
 */
export declare const EntityPicker: (props: FieldExtensionComponentProps<string, EntityPickerUiOptions>) => JSX.Element;
