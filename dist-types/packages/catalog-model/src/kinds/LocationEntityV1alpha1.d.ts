import type { Entity } from '../entity/Entity';
/**
 * Backstage catalog Location kind Entity.
 *
 * @public
 */
export interface LocationEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'Location';
    spec: {
        type?: string;
        target?: string;
        targets?: string[];
        presence?: 'required' | 'optional';
    };
}
/**
 * {@link KindValidator} for {@link LocationEntityV1alpha1}.
 *
 * @public
 */
export declare const locationEntityV1alpha1Validator: import("./types").KindValidator;
