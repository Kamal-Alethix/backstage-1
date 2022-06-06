/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
import { Writable } from 'stream';
import { Logger } from 'winston';
import { Octokit } from 'octokit';
/** @public */
export declare type RunCommandOptions = {
    /** command to run */
    command: string;
    /** arguments to pass the command */
    args: string[];
    /** options to pass to spawn */
    options?: SpawnOptionsWithoutStdio;
    /** stream to capture stdout and stderr output */
    logStream?: Writable;
};
/**
 * Run a command in a sub-process, normally a shell command.
 *
 * @public
 */
export declare const executeShellCommand: (options: RunCommandOptions) => Promise<void>;
export declare function initRepoAndPush({ dir, remoteUrl, auth, logger, defaultBranch, commitMessage, gitAuthorInfo, }: {
    dir: string;
    remoteUrl: string;
    auth: {
        username: string;
        password: string;
    };
    logger: Logger;
    defaultBranch?: string;
    commitMessage?: string;
    gitAuthorInfo?: {
        name?: string;
        email?: string;
    };
}): Promise<void>;
declare type BranchProtectionOptions = {
    client: Octokit;
    owner: string;
    repoName: string;
    logger: Logger;
    requireCodeOwnerReviews: boolean;
    requiredStatusCheckContexts?: string[];
    defaultBranch?: string;
};
export declare const enableBranchProtectionOnDefaultRepoBranch: ({ repoName, client, owner, logger, requireCodeOwnerReviews, requiredStatusCheckContexts, defaultBranch, }: BranchProtectionOptions) => Promise<void>;
export {};
