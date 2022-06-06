/// <reference types="node" />
import { IStorageFilesMock } from './types';
export declare const storageRootDir: string;
export declare class StorageFilesMock implements IStorageFilesMock {
    static rootDir: string;
    private files;
    constructor();
    emptyFiles(): void;
    fileExists(targetPath: string): boolean;
    readFile(targetPath: string): Buffer;
    writeFile(targetPath: string, sourcePath: string): void;
    writeFile(targetPath: string, sourceBuffer: Buffer): void;
}
