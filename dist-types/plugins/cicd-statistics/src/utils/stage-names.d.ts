import { Build } from '../apis/types';
export declare function defaultFormatStageName(parentNames: Array<string>, stageName: string): string;
export interface CleanupBuildTreeOptions {
    formatStageName: typeof defaultFormatStageName;
    lowerCase: boolean;
}
export declare function cleanupBuildTree(builds: Build[], opts: CleanupBuildTreeOptions): Promise<Build[]>;
