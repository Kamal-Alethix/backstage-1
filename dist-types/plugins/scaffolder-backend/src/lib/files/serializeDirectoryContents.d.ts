import { SerializedFile } from './types';
export declare const isExecutable: (fileMode: number | undefined) => boolean;
export declare function serializeDirectoryContents(sourcePath: string, options?: {
    gitignore?: boolean;
    globPatterns?: string[];
}): Promise<SerializedFile[]>;
