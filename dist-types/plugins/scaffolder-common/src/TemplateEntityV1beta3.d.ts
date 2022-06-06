import { Entity, KindValidator } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';
/**
 * Backstage catalog Template kind Entity. Templates are used by the Scaffolder
 * plugin to create new entities, such as Components.
 *
 * @public
 */
export interface TemplateEntityV1beta3 extends Entity {
    /**
     * The apiVersion string of the TaskSpec.
     */
    apiVersion: 'scaffolder.backstage.io/v1beta3';
    /**
     * The kind of the entity
     */
    kind: 'Template';
    /**
     * The specification of the Template Entity
     */
    spec: {
        /**
         * The type that the Template will create. For example service, website or library.
         */
        type: string;
        /**
         * This is a JSONSchema or an array of JSONSchema's which is used to render a form in the frontend
         * to collect user input and validate it against that schema. This can then be used in the `steps` part below to template
         * variables passed from the user into each action in the template.
         */
        parameters?: JsonObject | JsonObject[];
        /**
         * A list of steps to be executed in sequence which are defined by the template. These steps are a list of the underlying
         * javascript action and some optional input parameters that may or may not have been collected from the end user.
         */
        steps: Array<{
            id?: string;
            name?: string;
            action: string;
            input?: JsonObject;
            if?: string | boolean;
        }>;
        /**
         * The output is an object where template authors can pull out information from template actions and return them in a known standard way.
         */
        output?: {
            [name: string]: string;
        };
        /**
         * The owner entityRef of the TemplateEntity
         */
        owner?: string;
    };
}
/**
 * Entity data validator for {@link TemplateEntityV1beta3}.
 *
 * @public
 */
export declare const templateEntityV1beta3Validator: KindValidator;
