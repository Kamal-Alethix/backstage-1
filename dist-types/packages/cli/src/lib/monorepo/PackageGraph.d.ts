import { Package } from '@manypkg/get-packages';
import { PackageRole } from '../role';
declare type PackageJSON = Package['packageJson'];
export interface ExtendedPackageJSON extends PackageJSON {
    scripts?: {
        [key: string]: string;
    };
    bundled?: boolean;
    backstage?: {
        role?: PackageRole;
    };
}
export declare type ExtendedPackage = {
    dir: string;
    packageJson: ExtendedPackageJSON;
};
export declare type PackageGraphNode = {
    /** The name of the package */
    name: string;
    /** The directory of the package */
    dir: string;
    /** The package data of the package itself */
    packageJson: ExtendedPackageJSON;
    /** All direct local dependencies of the package */
    allLocalDependencies: Map<string, PackageGraphNode>;
    /** All direct local dependencies that will be present in the published package */
    publishedLocalDependencies: Map<string, PackageGraphNode>;
    /** Local dependencies */
    localDependencies: Map<string, PackageGraphNode>;
    /** Local devDependencies */
    localDevDependencies: Map<string, PackageGraphNode>;
    /** Local optionalDependencies */
    localOptionalDependencies: Map<string, PackageGraphNode>;
    /** All direct incoming local dependencies of the package */
    allLocalDependents: Map<string, PackageGraphNode>;
    /** All direct incoming local dependencies that will be present in the published package */
    publishedLocalDependents: Map<string, PackageGraphNode>;
    /** Incoming local dependencies */
    localDependents: Map<string, PackageGraphNode>;
    /** Incoming local devDependencies */
    localDevDependents: Map<string, PackageGraphNode>;
    /** Incoming local optionalDependencies */
    localOptionalDependents: Map<string, PackageGraphNode>;
};
export declare class PackageGraph extends Map<string, PackageGraphNode> {
    static listTargetPackages(): Promise<ExtendedPackage[]>;
    static fromPackages(packages: Package[]): PackageGraph;
    /**
     * Traverses the package graph and collects a set of package names.
     *
     * The traversal starts at the provided list names, and continues
     * throughout all the names returned by the `collectFn`, which is
     * called once for each seen package.
     */
    collectPackageNames(startingPackageNames: string[], collectFn: (pkg: PackageGraphNode) => Iterable<string> | undefined): Set<string>;
    listChangedPackages(options: {
        ref: string;
    }): Promise<PackageGraphNode[]>;
}
export {};
