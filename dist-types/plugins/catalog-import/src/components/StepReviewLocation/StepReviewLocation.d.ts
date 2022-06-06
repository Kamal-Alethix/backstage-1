/// <reference types="react" />
import { PrepareResult, ReviewResult } from '../useImportState';
declare type Props = {
    prepareResult: PrepareResult;
    onReview: (result: ReviewResult) => void;
    onGoBack?: () => void;
};
export declare const StepReviewLocation: ({ prepareResult, onReview, onGoBack, }: Props) => JSX.Element;
export {};
