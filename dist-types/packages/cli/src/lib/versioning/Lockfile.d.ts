declare type LockfileQueryEntry = {
    range: string;
    version: string;
};
/** Entries that have an invalid version range, for example an npm tag */
declare type AnalyzeResultInvalidRange = {
    name: string;
    range: string;
};
/** Entries that can be deduplicated by bumping to an existing higher version */
declare type AnalyzeResultNewVersion = {
    name: string;
    range: string;
    oldVersion: string;
    newVersion: string;
};
/** Entries that would need a dependency update in package.json to be deduplicated */
declare type AnalyzeResultNewRange = {
    name: string;
    oldRange: string;
    newRange: string;
    oldVersion: string;
    newVersion: string;
};
declare type AnalyzeResult = {
    invalidRanges: AnalyzeResultInvalidRange[];
    newVersions: AnalyzeResultNewVersion[];
    newRanges: AnalyzeResultNewRange[];
};
export declare class Lockfile {
    private readonly path;
    private readonly packages;
    private readonly data;
    private readonly legacy;
    static load(path: string): Promise<Lockfile>;
    private constructor();
    /** Get the entries for a single package in the lockfile */
    get(name: string): LockfileQueryEntry[] | undefined;
    /** Returns the name of all packages available in the lockfile */
    keys(): IterableIterator<string>;
    /** Analyzes the lockfile to identify possible actions and warnings for the entries */
    analyze(options?: {
        filter?: (name: string) => boolean;
    }): AnalyzeResult;
    remove(name: string, range: string): boolean;
    /** Modifies the lockfile by bumping packages to the suggested versions */
    replaceVersions(results: AnalyzeResultNewVersion[]): void;
    save(): Promise<void>;
    toString(): string;
}
export {};
