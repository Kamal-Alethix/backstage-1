/**
 * Contains mapping between Backstage release and package versions.
 * @public
 */
export declare type ReleaseManifest = {
    releaseVersion: string;
    packages: {
        name: string;
        version: string;
    }[];
};
/**
 * Options for {@link getManifestByVersion}.
 * @public
 */
export declare type GetManifestByVersionOptions = {
    version: string;
};
/**
 * Returns a release manifest based on supplied version.
 * @public
 */
export declare function getManifestByVersion(options: GetManifestByVersionOptions): Promise<ReleaseManifest>;
/**
 * Options for {@link getManifestByReleaseLine}.
 * @public
 */
export declare type GetManifestByReleaseLineOptions = {
    releaseLine: string;
};
/**
 * Returns a release manifest based on supplied release line.
 * @public
 */
export declare function getManifestByReleaseLine(options: GetManifestByReleaseLineOptions): Promise<ReleaseManifest>;
