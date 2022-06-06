import { JsonObject } from '@backstage/types';
import { ReactNode } from 'react';
import { ScaffolderDryRunResponse } from '../../types';
interface DryRunOptions {
    templateContent: string;
    values: JsonObject;
    files: Array<{
        path: string;
        content: string;
    }>;
}
interface DryRunResult extends ScaffolderDryRunResponse {
    id: number;
}
interface DryRun {
    results: DryRunResult[];
    selectedResult: DryRunResult | undefined;
    selectResult(id: number): void;
    deleteResult(id: number): void;
    execute(options: DryRunOptions): Promise<void>;
}
interface DryRunProviderProps {
    children: ReactNode;
}
export declare function base64EncodeContent(content: string): string;
export declare function DryRunProvider(props: DryRunProviderProps): JSX.Element;
export declare function useDryRun(): DryRun;
export {};
