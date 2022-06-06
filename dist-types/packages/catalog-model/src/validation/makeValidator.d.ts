import { Validators } from './types';
/**
 * Creates a {@link Validators} object from `overrides`, with default values taken from {@link KubernetesValidatorFunctions}
 *
 * @public
 */
export declare function makeValidator(overrides?: Partial<Validators>): Validators;
