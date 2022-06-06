import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { AnalyzeResult } from '../api';
/**
 * The configuration of the stepper.
 *
 * @public
 */
export declare type ImportFlows = 'unknown' | 'single-location' | 'multiple-locations' | 'no-location';
/**
 * Result of the prepare state.
 *
 * @public
 */
export declare type PrepareResult = {
    type: 'locations';
    locations: Array<{
        exists?: boolean;
        target: string;
        entities: CompoundEntityRef[];
    }>;
} | {
    type: 'repository';
    url: string;
    integrationType: string;
    pullRequest: {
        url: string;
    };
    locations: Array<{
        target: string;
        entities: CompoundEntityRef[];
    }>;
};
export declare type ReviewResult = {
    type: 'locations';
    locations: Array<{
        target: string;
        entities: Entity[];
    }>;
    refreshed: Array<{
        target: string;
    }>;
} | {
    type: 'repository';
    url: string;
    integrationType: string;
    pullRequest: {
        url: string;
    };
    locations: Array<{
        target: string;
        entities: Entity[];
    }>;
};
declare type onAnalysisFn = (flow: ImportFlows, url: string, result: AnalyzeResult, opts?: {
    prepareResult?: PrepareResult;
}) => void;
declare type onPrepareFn = (result: PrepareResult, opts?: {
    notRepeatable?: boolean;
}) => void;
declare type onReviewFn = (result: ReviewResult) => void;
declare type State = {
    activeState: 'analyze';
    onAnalysis: onAnalysisFn;
} | {
    activeState: 'prepare';
    analyzeResult: AnalyzeResult;
    prepareResult?: PrepareResult;
    onPrepare: onPrepareFn;
} | {
    activeState: 'review';
    analyzeResult: AnalyzeResult;
    prepareResult: PrepareResult;
    onReview: onReviewFn;
} | {
    activeState: 'finish';
    analyzeResult: AnalyzeResult;
    prepareResult: PrepareResult;
    reviewResult: ReviewResult;
};
export declare type ImportState = State & {
    activeFlow: ImportFlows;
    activeStepNumber: number;
    analysisUrl?: string;
    onGoBack?: () => void;
    onReset: () => void;
};
/**
 * A hook that manages the state machine of the form. It handles different flows
 * which each can implement up to four states:
 * 1. analyze
 * 2. preview (skippable from analyze->review)
 * 3. review
 * 4. finish
 *
 * @param options - options
 */
export declare const useImportState: (options?: {
    initialUrl?: string | undefined;
} | undefined) => ImportState;
export {};
