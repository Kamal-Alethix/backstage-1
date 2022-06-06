/// <reference types="react" />
import { AnalyzeResult } from '../../api';
import { PrepareResult } from '../useImportState';
declare type Props = {
    analyzeResult: Extract<AnalyzeResult, {
        type: 'locations';
    }>;
    prepareResult?: PrepareResult;
    onPrepare: (result: PrepareResult) => void;
    onGoBack?: () => void;
};
/**
 * A form that lets a user select one of a list of locations to import
 *
 * @param analyzeResult - the result of the analysis
 * @param prepareResult - the selectected locations from a previous step
 * @param onPrepare - called after the selection
 * @param onGoBack - called to go back to the previous step
 */
export declare const StepPrepareSelectLocations: ({ analyzeResult, prepareResult, onPrepare, onGoBack, }: Props) => JSX.Element;
export {};
