/// <reference types="react" />
import { JsonObject } from '@backstage/types';
import { FieldExtensionOptions } from '../../extensions';
interface TemplateEditorFormProps {
    content?: string;
    /** Setting this to true will cause the content to be parsed as if it is the template entity spec */
    contentIsSpec?: boolean;
    data: JsonObject;
    onUpdate: (data: JsonObject) => void;
    setErrorText: (errorText?: string) => void;
    onDryRun?: (data: JsonObject) => Promise<void>;
    fieldExtensions?: FieldExtensionOptions<any, any>[];
}
/** Shows the a template form that is parsed from the provided content */
export declare function TemplateEditorForm(props: TemplateEditorFormProps): JSX.Element | null;
export declare namespace TemplateEditorForm {
    var DirectoryEditorDryRun: typeof TemplateEditorFormDirectoryEditorDryRun;
}
/** A version of the TemplateEditorForm that is connected to the DirectoryEditor and DryRun contexts */
export declare function TemplateEditorFormDirectoryEditorDryRun(props: Pick<TemplateEditorFormProps, 'setErrorText' | 'fieldExtensions'>): JSX.Element;
export {};
