import { OptionValues } from 'commander';
import { YarnInfoInspectData } from '../../lib/versioning';
import { ReleaseManifest } from '@backstage/release-manifests';
import 'global-agent/bootstrap';
declare const _default: (opts: OptionValues) => Promise<void>;
export default _default;
export declare function createStrictVersionFinder(options: {
    releaseManifest: ReleaseManifest;
}): (name: string) => Promise<string>;
export declare function createVersionFinder(options: {
    releaseLine?: string;
    packageInfoFetcher?: () => Promise<YarnInfoInspectData>;
    releaseManifest?: ReleaseManifest;
}): (name: string) => Promise<string>;
export declare function bumpBackstageJsonVersion(version: string): Promise<void>;
