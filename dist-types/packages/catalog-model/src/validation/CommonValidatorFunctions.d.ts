/**
 * Contains various helper validation and normalization functions that can be
 * composed to form a Validator.
 *
 * @public
 */
export declare class CommonValidatorFunctions {
    /**
     * Checks that the value is on the form <suffix> or <prefix><separator><suffix>, and validates
     * those parts separately.
     *
     * @param value - The value to check
     * @param separator - The separator between parts
     * @param isValidPrefix - Checks that the part before the separator is valid, if present
     * @param isValidSuffix - Checks that the part after the separator (or the entire value if there is no separator) is valid
     */
    static isValidPrefixAndOrSuffix(value: unknown, separator: string, isValidPrefix: (value: string) => boolean, isValidSuffix: (value: string) => boolean): boolean;
    /**
     * Checks that the value can be safely transferred as JSON.
     *
     * @param value - The value to check
     */
    static isJsonSafe(value: unknown): boolean;
    /**
     * Checks that the value is a valid DNS subdomain name.
     *
     * @param value - The value to check
     * @see https://tools.ietf.org/html/rfc1123
     */
    static isValidDnsSubdomain(value: unknown): boolean;
    /**
     * Checks that the value is a valid DNS label.
     *
     * @param value - The value to check
     * @see https://tools.ietf.org/html/rfc1123
     */
    static isValidDnsLabel(value: unknown): boolean;
    /**
     * Checks that the value is a valid tag.
     *
     * @deprecated This will be removed in a future release
     * @param value - The value to check
     */
    static isValidTag(value: unknown): boolean;
    /**
     * Checks that the value is a valid string URL.
     *
     * @param value - The value to check
     */
    static isValidUrl(value: unknown): boolean;
    /**
     * Checks that the value is a non empty string value.
     *
     * @deprecated use isNonEmptyString instead
     * @param value - The value to check
     */
    static isValidString(value: unknown): boolean;
    /**
     * Checks that the value is a string value that's not empty.
     *
     * @param value - The value to check
     */
    static isNonEmptyString(value: unknown): value is string;
}
