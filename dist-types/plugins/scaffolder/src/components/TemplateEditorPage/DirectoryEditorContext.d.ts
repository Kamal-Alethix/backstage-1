import { ReactNode } from 'react';
import { TemplateDirectoryAccess } from '../../lib/filesystem';
interface DirectoryEditorFile {
    /** The path of the file relative to the root directory */
    path: string;
    /** The staged content of the file */
    content: string;
    /** Whether the staged content matches what is on disk */
    dirty: boolean;
    /** Update the staged content of the file without saving */
    updateContent(content: string): void;
    /** Save the staged content of the file to disk */
    save(): Promise<void>;
    /** Reload the staged content of the file from disk */
    reload(): Promise<void>;
}
interface DirectoryEditor {
    /** A list of all files in the edited directory */
    files: Array<DirectoryEditorFile>;
    /** The currently selected file */
    selectedFile: DirectoryEditorFile | undefined;
    /** Switch the selected file */
    setSelectedFile(path: string | undefined): void;
    /** Save all files to disk */
    save(): Promise<void>;
    /** Reload all files from disk */
    reload(): Promise<void>;
    subscribe(listener: () => void): () => void;
}
export declare function useDirectoryEditor(): DirectoryEditor;
interface DirectoryEditorProviderProps {
    directory: TemplateDirectoryAccess;
    children?: ReactNode;
}
export declare function DirectoryEditorProvider(props: DirectoryEditorProviderProps): JSX.Element;
export {};
