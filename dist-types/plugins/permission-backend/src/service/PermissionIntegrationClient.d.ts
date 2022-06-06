import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { ConditionalPolicyDecision } from '@backstage/plugin-permission-common';
import { ApplyConditionsRequestEntry, ApplyConditionsResponseEntry } from '@backstage/plugin-permission-node';
export declare type ResourcePolicyDecision = ConditionalPolicyDecision & {
    resourceRef: string;
};
export declare class PermissionIntegrationClient {
    private readonly discovery;
    constructor(options: {
        discovery: PluginEndpointDiscovery;
    });
    applyConditions(pluginId: string, decisions: readonly ApplyConditionsRequestEntry[], authHeader?: string): Promise<ApplyConditionsResponseEntry[]>;
}
