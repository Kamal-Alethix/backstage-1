import { JsonObject } from '@backstage/types';
import { TemplateAction } from './types';
/**
 * This function is used to create new template actions to get type safety.
 * @public
 */
export declare const createTemplateAction: <TInput extends JsonObject>(templateAction: TemplateAction<TInput>) => TemplateAction<TInput>;
