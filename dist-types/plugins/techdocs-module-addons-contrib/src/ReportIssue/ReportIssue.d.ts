/// <reference types="react" />
import { ReportIssueTemplateBuilder } from './types';
/**
 * Props customizing the <ReportIssue /> Addon.
 *
 * @public
 */
export declare type ReportIssueProps = {
    /**
     * Number of milliseconds after a user highlights some text before the report
     * issue link appears above the highlighted text. Defaults to 500ms.
     */
    debounceTime?: number;
    /**
     * An optional function defining how a custom issue title and body should be
     * constructed, given some selected text.
     */
    templateBuilder?: ReportIssueTemplateBuilder;
};
/**
 * Show report issue button when text is highlighted
 */
export declare const ReportIssueAddon: ({ debounceTime, templateBuilder: buildTemplate, }: ReportIssueProps) => JSX.Element | null;
