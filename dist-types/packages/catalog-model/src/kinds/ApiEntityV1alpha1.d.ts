import type { Entity } from '../entity/Entity';
/**
 * Backstage API kind Entity. APIs describe the interfaces for Components to communicate.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ApiEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'API';
    spec: {
        type: string;
        lifecycle: string;
        owner: string;
        definition: string;
        system?: string;
    };
}
/**
 * {@link KindValidator} for {@link ApiEntityV1alpha1}.
 *
 * @public
 */
export declare const apiEntityV1alpha1Validator: import("./types").KindValidator;
