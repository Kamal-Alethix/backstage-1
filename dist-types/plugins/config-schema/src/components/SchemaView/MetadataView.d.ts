/// <reference types="react" />
import { JsonValue } from '@backstage/types';
import { Schema } from 'jsonschema';
export interface MetadataViewRowProps {
    label: string;
    text?: string;
    data?: JsonValue;
}
export declare function MetadataViewRow({ label, text, data }: MetadataViewRowProps): JSX.Element | null;
export declare function MetadataView({ schema }: {
    schema: Schema;
}): JSX.Element;
