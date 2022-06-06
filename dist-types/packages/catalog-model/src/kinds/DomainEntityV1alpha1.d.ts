import type { Entity } from '../entity/Entity';
/**
 * Backstage Domain kind Entity. Domains group Systems together.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface DomainEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'Domain';
    spec: {
        owner: string;
    };
}
/**
 * {@link KindValidator} for {@link DomainEntityV1alpha1}.
 *
 * @public
 */
export declare const domainEntityV1alpha1Validator: import("./types").KindValidator;
