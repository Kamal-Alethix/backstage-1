/// <reference types="node" />
export interface SerializedFile {
    path: string;
    content: Buffer;
    executable?: boolean;
}
