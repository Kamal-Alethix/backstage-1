import { CostInsightsApi, ProductInsightsOptions, Alert, Cost, Entity, Group, MetricData, Project } from '@backstage/plugin-cost-insights';
export declare class CostInsightsClient implements CostInsightsApi {
    getLastCompleteBillingDate(): Promise<string>;
    getUserGroups(userId: string): Promise<Group[]>;
    getGroupProjects(group: string): Promise<Project[]>;
    getAlerts(group: string): Promise<Alert[]>;
    getDailyMetricData(metric: string, intervals: string): Promise<MetricData>;
    getGroupDailyCost(group: string, intervals: string): Promise<Cost>;
    getProjectDailyCost(project: string, intervals: string): Promise<Cost>;
    getProductInsights(options: ProductInsightsOptions): Promise<Entity>;
}
