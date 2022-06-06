import type { Entity } from '../entity/Entity';
/**
 * Backstage catalog Group kind Entity.
 *
 * @public
 */
export interface GroupEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'Group';
    spec: {
        type: string;
        profile?: {
            displayName?: string;
            email?: string;
            picture?: string;
        };
        parent?: string;
        children: string[];
        members?: string[];
    };
}
/**
 * {@link KindValidator} for {@link GroupEntityV1alpha1}.
 * @public
 */
export declare const groupEntityV1alpha1Validator: import("./types").KindValidator;
