/// <reference types="react" />
import { FieldExtensionComponentProps } from '../../../extensions';
/**
 * The input props that can be specified under `ui:options` for the
 * `EntityTagsPicker` field extension.
 *
 * @public
 */
export interface EntityTagsPickerUiOptions {
    kinds?: string[];
}
/**
 * The underlying component that is rendered in the form for the `EntityTagsPicker`
 * field extension.
 *
 * @public
 */
export declare const EntityTagsPicker: (props: FieldExtensionComponentProps<string[], EntityTagsPickerUiOptions>) => JSX.Element;
