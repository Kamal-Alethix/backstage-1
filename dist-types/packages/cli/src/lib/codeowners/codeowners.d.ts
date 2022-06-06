export declare function getCodeownersFilePath(rootDir: string): Promise<string | undefined>;
export declare function isValidSingleOwnerId(id: string): boolean;
export declare function parseOwnerIds(spaceSeparatedOwnerIds: string | undefined): string[] | undefined;
export declare function addCodeownersEntry(ownedPath: string, ownerStr: string, codeownersFilePath?: string): Promise<boolean>;
