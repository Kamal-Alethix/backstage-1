/// <reference types="react" />
declare type FileStructureObject = Record<string, any>;
declare type CoverageTableRow = {
    filename?: string;
    files: CoverageTableRow[];
    coverage: number;
    missing: number;
    tracked: number;
    path: string;
    tableData?: {
        id: number;
    };
};
export declare const groupByPath: (files: CoverageTableRow[]) => FileStructureObject;
export declare const buildFileStructure: (row: CoverageTableRow) => CoverageTableRow;
export declare const getObjectsAtPath: (curData: CoverageTableRow | undefined, path: string[]) => CoverageTableRow[] | undefined;
export declare const FileExplorer: () => JSX.Element | null;
export {};
