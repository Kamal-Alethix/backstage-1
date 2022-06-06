import { Schema } from 'jsonschema';
export interface SchemaViewProps {
    path: string;
    depth: number;
    schema: Schema;
}
