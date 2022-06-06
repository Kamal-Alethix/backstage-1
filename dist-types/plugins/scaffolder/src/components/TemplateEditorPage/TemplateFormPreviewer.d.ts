/// <reference types="react" />
import { FieldExtensionOptions } from '../../extensions';
export declare const TemplateFormPreviewer: ({ defaultPreviewTemplate, customFieldExtensions, onClose, }: {
    defaultPreviewTemplate?: string | undefined;
    customFieldExtensions?: FieldExtensionOptions<any, any>[] | undefined;
    onClose?: (() => void) | undefined;
}) => JSX.Element;
