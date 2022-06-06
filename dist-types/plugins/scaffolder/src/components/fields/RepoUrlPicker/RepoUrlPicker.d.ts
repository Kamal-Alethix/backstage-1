/// <reference types="react" />
import { FieldExtensionComponentProps } from '../../../extensions';
/**
 * The input props that can be specified under `ui:options` for the
 * `RepoUrlPicker` field extension.
 *
 * @public
 */
export interface RepoUrlPickerUiOptions {
    allowedHosts?: string[];
    allowedOwners?: string[];
    requestUserCredentials?: {
        secretsKey: string;
        additionalScopes?: {
            gerrit?: string[];
            github?: string[];
            gitlab?: string[];
            bitbucket?: string[];
            azure?: string[];
        };
    };
}
/**
 * The underlying component that is rendered in the form for the `RepoUrlPicker`
 * field extension.
 *
 * @public
 */
export declare const RepoUrlPicker: (props: FieldExtensionComponentProps<string, RepoUrlPickerUiOptions>) => JSX.Element;
