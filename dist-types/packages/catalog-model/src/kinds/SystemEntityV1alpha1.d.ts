import type { Entity } from '../entity/Entity';
/**
 * Backstage catalog System kind Entity. Systems group Comopnents, Resources and APIs together.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface SystemEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'System';
    spec: {
        owner: string;
        domain?: string;
    };
}
/**
 * {@link KindValidator} for {@link SystemEntityV1alpha1}.
 *
 * @public
 */
export declare const systemEntityV1alpha1Validator: import("./types").KindValidator;
