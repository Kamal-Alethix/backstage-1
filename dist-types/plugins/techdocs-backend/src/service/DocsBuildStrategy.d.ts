import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
/**
 * Parameters passed to the shouldBuild method on the DocsBuildStrategy interface
 *
 * @public
 */
export declare type ShouldBuildParameters = {
    entity: Entity;
};
/**
 * A strategy for when to build TechDocs locally, and when to skip building TechDocs (allowing for an external build)
 *
 * @public
 */
export interface DocsBuildStrategy {
    shouldBuild(params: ShouldBuildParameters): Promise<boolean>;
}
export declare class DefaultDocsBuildStrategy {
    private readonly config;
    private constructor();
    static fromConfig(config: Config): DefaultDocsBuildStrategy;
    shouldBuild(_: ShouldBuildParameters): Promise<boolean>;
}
