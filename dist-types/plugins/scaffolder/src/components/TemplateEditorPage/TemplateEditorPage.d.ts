/// <reference types="react" />
import { FieldExtensionOptions } from '../../extensions';
interface TemplateEditorPageProps {
    defaultPreviewTemplate?: string;
    customFieldExtensions?: FieldExtensionOptions<any, any>[];
}
export declare function TemplateEditorPage(props: TemplateEditorPageProps): JSX.Element;
export {};
