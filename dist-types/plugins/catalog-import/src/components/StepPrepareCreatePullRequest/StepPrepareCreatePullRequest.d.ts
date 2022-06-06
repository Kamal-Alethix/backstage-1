import { Entity } from '@backstage/catalog-model';
import React from 'react';
import { UnpackNestedValue, UseFormReturn } from 'react-hook-form';
import { AnalyzeResult } from '../../api';
import { PartialEntity } from '../../types';
import { PrepareResult } from '../useImportState';
declare type FormData = {
    title: string;
    body: string;
    componentName: string;
    owner: string;
    useCodeowners: boolean;
};
/**
 * Props for {@link StepPrepareCreatePullRequest}.
 *
 * @public
 */
export interface StepPrepareCreatePullRequestProps {
    analyzeResult: Extract<AnalyzeResult, {
        type: 'repository';
    }>;
    onPrepare: (result: PrepareResult, opts?: {
        notRepeatable?: boolean;
    }) => void;
    onGoBack?: () => void;
    renderFormFields: (props: Pick<UseFormReturn<FormData>, 'register' | 'setValue' | 'formState'> & {
        values: UnpackNestedValue<FormData>;
        groups: string[];
        groupsLoading: boolean;
    }) => React.ReactNode;
}
export declare function generateEntities(entities: PartialEntity[], componentName: string, owner?: string): Entity[];
/**
 * Prepares a pull request.
 *
 * @public
 */
export declare const StepPrepareCreatePullRequest: (props: StepPrepareCreatePullRequestProps) => JSX.Element;
export {};
