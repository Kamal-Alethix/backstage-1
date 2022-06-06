import { MergeResult, ReadCommitResult } from 'isomorphic-git';
import { Logger } from 'winston';
/**
 * A convenience wrapper around the `isomorphic-git` library.
 *
 * @public
 */
export declare class Git {
    private readonly config;
    private constructor();
    add(options: {
        dir: string;
        filepath: string;
    }): Promise<void>;
    addRemote(options: {
        dir: string;
        remote: string;
        url: string;
    }): Promise<void>;
    commit(options: {
        dir: string;
        message: string;
        author: {
            name: string;
            email: string;
        };
        committer: {
            name: string;
            email: string;
        };
    }): Promise<string>;
    /** https://isomorphic-git.org/docs/en/clone */
    clone(options: {
        url: string;
        dir: string;
        ref?: string;
        depth?: number;
        noCheckout?: boolean;
    }): Promise<void>;
    /** https://isomorphic-git.org/docs/en/currentBranch */
    currentBranch(options: {
        dir: string;
        fullName?: boolean;
    }): Promise<string | undefined>;
    /** https://isomorphic-git.org/docs/en/fetch */
    fetch(options: {
        dir: string;
        remote?: string;
    }): Promise<void>;
    init(options: {
        dir: string;
        defaultBranch?: string;
    }): Promise<void>;
    /** https://isomorphic-git.org/docs/en/merge */
    merge(options: {
        dir: string;
        theirs: string;
        ours?: string;
        author: {
            name: string;
            email: string;
        };
        committer: {
            name: string;
            email: string;
        };
    }): Promise<MergeResult>;
    push(options: {
        dir: string;
        remote: string;
    }): Promise<import("isomorphic-git").PushResult>;
    /** https://isomorphic-git.org/docs/en/readCommit */
    readCommit(options: {
        dir: string;
        sha: string;
    }): Promise<ReadCommitResult>;
    /** https://isomorphic-git.org/docs/en/resolveRef */
    resolveRef(options: {
        dir: string;
        ref: string;
    }): Promise<string>;
    /** https://isomorphic-git.org/docs/en/log */
    log(options: {
        dir: string;
        ref?: string;
    }): Promise<ReadCommitResult[]>;
    private onAuth;
    private onProgressHandler;
    static fromAuth: (options: {
        username?: string;
        password?: string;
        logger?: Logger;
    }) => Git;
}
