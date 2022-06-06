/**
 * Type alias for implementing validators of various entity objects.
 *
 * @public
 */
export declare type Validators = {
    isValidApiVersion(value: unknown): boolean;
    isValidKind(value: unknown): boolean;
    isValidEntityName(value: unknown): boolean;
    isValidNamespace(value: unknown): boolean;
    isValidLabelKey(value: unknown): boolean;
    isValidLabelValue(value: unknown): boolean;
    isValidAnnotationKey(value: unknown): boolean;
    isValidAnnotationValue(value: unknown): boolean;
    isValidTag(value: unknown): boolean;
};
