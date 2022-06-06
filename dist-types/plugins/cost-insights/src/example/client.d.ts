import { CostInsightsApi, ProductInsightsOptions } from '../api';
import { Alert, Cost, Entity, Group, MetricData, Project } from '../types';
export declare class ExampleCostInsightsClient implements CostInsightsApi {
    private request;
    getLastCompleteBillingDate(): Promise<string>;
    getUserGroups(userId: string): Promise<Group[]>;
    getGroupProjects(group: string): Promise<Project[]>;
    getDailyMetricData(metric: string, intervals: string): Promise<MetricData>;
    getGroupDailyCost(group: string, intervals: string): Promise<Cost>;
    getProjectDailyCost(project: string, intervals: string): Promise<Cost>;
    getProductInsights(options: ProductInsightsOptions): Promise<Entity>;
    getAlerts(group: string): Promise<Alert[]>;
}
