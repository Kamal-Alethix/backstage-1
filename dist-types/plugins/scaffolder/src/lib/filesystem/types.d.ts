export interface TemplateFileAccess {
    path: string;
    file(): Promise<File>;
    save(data: string | BufferSource | Blob): Promise<void>;
}
export interface TemplateDirectoryAccess {
    listFiles(): Promise<Array<TemplateFileAccess>>;
}
