import { JsonObject } from '@backstage/types';
import { TemplateAction } from './types';
/**
 * Registry of all registered template actions.
 * @public
 */
export declare class TemplateActionRegistry {
    private readonly actions;
    register<TInput extends JsonObject>(action: TemplateAction<TInput>): void;
    get(actionId: string): TemplateAction<JsonObject>;
    list(): TemplateAction<JsonObject>[];
}
