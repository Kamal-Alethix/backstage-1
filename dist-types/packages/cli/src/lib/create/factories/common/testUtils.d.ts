/// <reference types="node" />
import { WriteStream } from 'tty';
export declare function mockPaths(options: {
    ownDir?: string;
    ownRoot?: string;
    targetDir?: string;
    targetRoot?: string;
}): void;
export declare function createMockOutputStream(): readonly [string[], WriteStream & {
    fd: any;
}];
