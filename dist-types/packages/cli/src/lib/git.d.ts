/**
 * Run a git command, trimming the output splitting it into lines.
 */
export declare function runGit(...args: string[]): Promise<string[]>;
/**
 * Returns a sorted list of all files that have changed since the merge base
 * of the provided `ref` and HEAD, as well as all files that are not tracked by git.
 */
export declare function listChangedFiles(ref: string): Promise<string[]>;
