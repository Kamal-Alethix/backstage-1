/// <reference types="react" />
/** A wrapper around CodeMirror with an error panel and extra actions available */
export declare function TemplateEditorTextArea(props: {
    content?: string;
    onUpdate?: (content: string) => void;
    errorText?: string;
    onSave?: () => void;
    onReload?: () => void;
}): JSX.Element;
export declare namespace TemplateEditorTextArea {
    var DirectoryEditor: typeof TemplateEditorDirectoryEditorTextArea;
}
/** A version of the TemplateEditorTextArea that is connected to the DirectoryEditor context */
export declare function TemplateEditorDirectoryEditorTextArea(props: {
    errorText?: string;
}): JSX.Element;
