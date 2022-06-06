/**
 * Contains validation functions that match the Kubernetes spec, usable to
 * build a catalog that is compatible with those rule sets.
 *
 * @public
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/names/
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/#syntax-and-character-set
 */
export declare class KubernetesValidatorFunctions {
    static isValidApiVersion(value: unknown): boolean;
    static isValidKind(value: unknown): boolean;
    static isValidObjectName(value: unknown): boolean;
    static isValidNamespace(value: unknown): boolean;
    static isValidLabelKey(value: unknown): boolean;
    static isValidLabelValue(value: unknown): boolean;
    static isValidAnnotationKey(value: unknown): boolean;
    static isValidAnnotationValue(value: unknown): boolean;
}
