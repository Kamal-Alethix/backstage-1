/// <reference types="react" />
import { JsonObject } from '@backstage/types';
import { FormProps, IChangeEvent, UiSchema } from '@rjsf/core';
declare type Step = {
    schema: JsonObject;
    title: string;
} & Partial<Omit<FormProps<any>, 'schema'>>;
declare type Props = {
    /**
     * Steps for the form, each contains title and form schema
     */
    steps: Step[];
    formData: Record<string, any>;
    onChange: (e: IChangeEvent) => void;
    onReset: () => void;
    onFinish?: () => Promise<void>;
    widgets?: FormProps<any>['widgets'];
    fields?: FormProps<any>['fields'];
    finishButtonLabel?: string;
};
export declare function getUiSchemasFromSteps(steps: Step[]): UiSchema[];
export declare function getReviewData(formData: Record<string, any>, steps: Step[]): Record<string, any>;
export declare const MultistepJsonForm: (props: Props) => JSX.Element;
export {};
