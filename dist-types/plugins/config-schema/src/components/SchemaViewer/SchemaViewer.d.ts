/// <reference types="react" />
import { Schema } from 'jsonschema';
export interface SchemaViewerProps {
    schema: Schema;
}
export declare const SchemaViewer: ({ schema }: SchemaViewerProps) => JSX.Element;
