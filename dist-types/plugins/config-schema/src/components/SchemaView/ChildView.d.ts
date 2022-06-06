/// <reference types="react" />
import { JsonValue } from '@backstage/types';
import { Schema } from 'jsonschema';
export interface MetadataViewRowProps {
    label: string;
    text?: string;
    data?: JsonValue;
}
export declare function ChildView({ path, depth, schema, required, lastChild, }: {
    path: string;
    depth: number;
    schema?: Schema;
    required?: boolean;
    lastChild?: boolean;
}): JSX.Element;
