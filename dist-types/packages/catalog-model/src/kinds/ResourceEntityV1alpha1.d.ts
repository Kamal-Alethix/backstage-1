import type { Entity } from '../entity/Entity';
/**
 * Backstage catalog Resource kind Entity. Represents infrastructure required to operate Components.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ResourceEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'Resource';
    spec: {
        type: string;
        owner: string;
        dependsOn?: string[];
        dependencyOf?: string[];
        system?: string;
    };
}
/**
 * {@link KindValidator} for {@link ResourceEntityV1alpha1}.
 *
 * @public
 */
export declare const resourceEntityV1alpha1Validator: import("./types").KindValidator;
