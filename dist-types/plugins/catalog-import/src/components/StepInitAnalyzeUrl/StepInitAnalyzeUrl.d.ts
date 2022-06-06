/// <reference types="react" />
import { AnalyzeResult } from '../../api';
import { ImportFlows, PrepareResult } from '../useImportState';
/**
 * Props for {@link StepInitAnalyzeUrl}.
 *
 * @public
 */
export interface StepInitAnalyzeUrlProps {
    onAnalysis: (flow: ImportFlows, url: string, result: AnalyzeResult, opts?: {
        prepareResult?: PrepareResult;
    }) => void;
    disablePullRequest?: boolean;
    analysisUrl?: string;
    exampleLocationUrl?: string;
}
/**
 * A form that lets the user input a url and analyze it for existing locations or potential entities.
 *
 * @param onAnalysis - is called when the analysis was successful
 * @param analysisUrl - a url that can be used as a default value
 * @param disablePullRequest - if true, repositories without entities will abort the wizard
 * @public
 */
export declare const StepInitAnalyzeUrl: (props: StepInitAnalyzeUrlProps) => JSX.Element;
