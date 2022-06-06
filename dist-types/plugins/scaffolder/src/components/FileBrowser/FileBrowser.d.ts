/// <reference types="react" />
export declare type FileEntry = {
    type: 'file';
    name: string;
    path: string;
} | {
    type: 'directory';
    name: string;
    path: string;
    children: FileEntry[];
};
export declare function parseFileEntires(paths: string[]): FileEntry[];
interface FileBrowserProps {
    /** A list of all filepaths to show, directories are separated with a `/` */
    filePaths: string[];
    /** The currently selected file */
    selected?: string;
    /** Callback for when a file is selected */
    onSelect?(filePath: string): void;
}
/** A simple file browser that allows you to select individual files */
export declare function FileBrowser(props: FileBrowserProps): JSX.Element;
export {};
