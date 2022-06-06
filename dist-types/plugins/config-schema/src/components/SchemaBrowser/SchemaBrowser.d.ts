import { Schema } from 'jsonschema';
import { ReactNode } from 'react';
export declare function createSchemaBrowserItems(expanded: string[], schema: Schema, path?: string, depth?: number): ReactNode;
export declare function SchemaBrowser({ schema }: {
    schema: Schema;
}): JSX.Element;
