/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Schema } from 'jsonschema';
import { Observable } from '@backstage/types';

interface ConfigSchemaResult {
    schema?: Schema;
}
interface ConfigSchemaApi {
    schema$(): Observable<ConfigSchemaResult>;
}
declare const configSchemaApiRef: _backstage_core_plugin_api.ApiRef<ConfigSchemaApi>;

/**
 * A ConfigSchemaApi implementation that loads the configuration from a URL.
 *
 * @public
 */
declare class StaticSchemaLoader implements ConfigSchemaApi {
    private readonly url;
    constructor(options?: {
        url?: string;
    });
    schema$(): Observable<ConfigSchemaResult>;
    private fetchSchema;
}

declare const configSchemaPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const ConfigSchemaPage: () => JSX.Element;

export { ConfigSchemaApi, ConfigSchemaPage, StaticSchemaLoader, configSchemaApiRef, configSchemaPlugin };
