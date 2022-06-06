import { ConfigSchemaApi, ConfigSchemaResult } from './types';
import { Observable } from '@backstage/types';
/**
 * A ConfigSchemaApi implementation that loads the configuration from a URL.
 *
 * @public
 */
export declare class StaticSchemaLoader implements ConfigSchemaApi {
    private readonly url;
    constructor(options?: {
        url?: string;
    });
    schema$(): Observable<ConfigSchemaResult>;
    private fetchSchema;
}
