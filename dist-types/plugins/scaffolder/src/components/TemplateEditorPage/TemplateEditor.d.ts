/// <reference types="react" />
import { FieldExtensionOptions } from '../../extensions';
import { TemplateDirectoryAccess } from '../../lib/filesystem';
export declare const TemplateEditor: (props: {
    directory: TemplateDirectoryAccess;
    fieldExtensions?: FieldExtensionOptions<any, any>[];
    onClose?: () => void;
}) => JSX.Element;
