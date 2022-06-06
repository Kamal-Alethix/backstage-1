import type { Entity } from '../entity/Entity';
/**
 * Backstage catalog User kind Entity.
 *
 * @public
 */
export interface UserEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'User';
    spec: {
        profile?: {
            displayName?: string;
            email?: string;
            picture?: string;
        };
        memberOf?: string[];
    };
}
/**
 * {@link KindValidator} for {@link UserEntityV1alpha1}.
 *
 * @public
 */
export declare const userEntityV1alpha1Validator: import("./types").KindValidator;
