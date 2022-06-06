/// <reference types="react" />
import { InfoCardVariants } from '@backstage/core-components';
import { ImportFlows } from '../useImportState';
import { StepperProvider } from './defaults';
/**
 * Props for {@link ImportStepper}.
 *
 * @public
 */
export interface ImportStepperProps {
    initialUrl?: string;
    generateStepper?: (flow: ImportFlows, defaults: StepperProvider) => StepperProvider;
    variant?: InfoCardVariants;
}
/**
 * The stepper that holds the different import stages.
 *
 * @public
 */
export declare const ImportStepper: (props: ImportStepperProps) => JSX.Element;
