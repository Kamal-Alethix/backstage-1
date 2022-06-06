import { DependencyList } from 'react';
declare type AsyncState<T> = {
    loading: boolean;
    error?: undefined;
    value?: undefined;
} | {
    loading: true;
    error?: Error | undefined;
    value?: T;
} | {
    loading: false;
    error: Error;
    value?: undefined;
} | {
    loading: false;
    error?: undefined;
    value: T;
};
export interface ProgressStep extends ProgessAsSingle {
    title: string;
}
export interface ProgessAsSteps {
    steps: Array<ProgressStep>;
}
export interface ProgessAsSingle<T = number> {
    progress?: T;
    progressBuffer?: T;
}
export declare type ProgessState<T = number> = ProgessAsSingle<T> | (T extends number ? ProgessAsSteps : {
    steps?: undefined;
});
export declare type ProgressAsLoading = ProgessState & {
    loading: true;
    error?: undefined;
    value?: undefined;
};
export declare type ProgressAsError = ProgessState<undefined> & {
    loading?: false | undefined;
    error: Error;
    value?: undefined;
};
export declare type ProgressAsValue<T> = ProgessState<undefined> & {
    loading?: false | undefined;
    error?: undefined;
    value: T;
};
/**
 * An AsyncState but with the addition of progress (decimal 0-1) to allow
 * rendering a progress bar while waiting.
 */
export declare type ProgressType<T> = ProgressAsLoading | ProgressAsError | ProgressAsValue<T>;
/**
 * Casts an AsyncState or Progress into its non-succeeded sub types
 */
declare type Unsuccessful<S extends ProgressType<any> | AsyncState<any>> = S extends ProgressType<any> ? ProgressAsLoading | ProgressAsError : Omit<AsyncState<any>, 'value'>;
/**
 * Similar to useAsync except it "waits" for a dependent (upstream) async state
 * to finish first, otherwise it forwards the dependent pending state.
 *
 * When/if the dependent state has settled successfully, the callback will be
 * invoked for a new layer of async state with the dependent (upstream) success
 * result as argument.
 */
export declare function useAsyncChain<S extends ProgressType<any> | AsyncState<any>, R>(parentState: S, fn: (value: NonNullable<S['value']>) => Promise<R>, deps: DependencyList): Unsuccessful<S> | AsyncState<R>;
export declare function renderFallbacks<T>(state: ProgressType<T> | AsyncState<T>, success: (value: T) => JSX.Element): JSX.Element;
export declare function ViewProgress({ state, }: {
    state: ProgressAsLoading | {
        loading: boolean;
    };
}): JSX.Element;
export {};
