/// <reference types="node" />
export interface IStorageFilesMock {
    emptyFiles(): void;
    fileExists(targetPath: string): boolean;
    readFile(targetPath: string): Buffer;
    writeFile(targetPath: string, sourcePath: string): void;
    writeFile(targetPath: string, sourceBuffer: Buffer): void;
    writeFile(targetPath: string, source: string | Buffer): void;
}
