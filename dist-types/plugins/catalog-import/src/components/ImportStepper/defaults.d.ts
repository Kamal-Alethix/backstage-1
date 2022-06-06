import React from 'react';
import { StepperApis } from '../types';
import { ImportFlows, ImportState } from '../useImportState';
export declare type StepConfiguration = {
    stepLabel: React.ReactElement;
    content: React.ReactElement;
};
/**
 * Defines the details of the stepper.
 *
 * @public
 */
export interface StepperProvider {
    analyze: (s: Extract<ImportState, {
        activeState: 'analyze';
    }>, opts: {
        apis: StepperApis;
    }) => StepConfiguration;
    prepare: (s: Extract<ImportState, {
        activeState: 'prepare';
    }>, opts: {
        apis: StepperApis;
    }) => StepConfiguration;
    review: (s: Extract<ImportState, {
        activeState: 'review';
    }>, opts: {
        apis: StepperApis;
    }) => StepConfiguration;
    finish: (s: Extract<ImportState, {
        activeState: 'finish';
    }>, opts: {
        apis: StepperApis;
    }) => StepConfiguration;
}
/**
 * The default stepper generation function.
 *
 * Override this function to customize the import flow. Each flow should at
 * least override the prepare operation.
 *
 * @param flow - the name of the active flow
 * @param defaults - the default steps
 * @public
 */
export declare function defaultGenerateStepper(flow: ImportFlows, defaults: StepperProvider): StepperProvider;
export declare const defaultStepper: StepperProvider;
