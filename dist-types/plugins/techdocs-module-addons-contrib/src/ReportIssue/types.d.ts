/**
 * Properties for creating an issue in a remote issue tracker.
 *
 * @public
 */
export declare type ReportIssueTemplate = {
    /**
     * The title of the issue.
     */
    title: string;
    /**
     * The body or description of the issue.
     */
    body: string;
};
/**
 * A function for returning a custom issue template, given a selection of text
 * on a TechDocs page.
 *
 * @public
 */
export declare type ReportIssueTemplateBuilder = ({ selection, }: {
    selection: Selection;
}) => ReportIssueTemplate;
export declare type Repository = {
    type: string;
    name: string;
    owner: string;
    protocol: string;
    resource: string;
};
