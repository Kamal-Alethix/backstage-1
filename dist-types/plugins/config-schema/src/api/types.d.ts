import { Schema } from 'jsonschema';
import { Observable } from '@backstage/types';
export interface ConfigSchemaResult {
    schema?: Schema;
}
export interface ConfigSchemaApi {
    schema$(): Observable<ConfigSchemaResult>;
}
export declare const configSchemaApiRef: import("@backstage/core-plugin-api").ApiRef<ConfigSchemaApi>;
