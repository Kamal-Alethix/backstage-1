/**
 * Represents a single check defined on the TechInsights backend.
 *
 * @public
 */
export declare type Check = {
    id: string;
    type: string;
    name: string;
    description: string;
    factIds: string[];
};
