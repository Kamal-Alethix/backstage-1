import { FactRetrieverContext, FactRetrieverRegistration, TechInsightsStore } from '@backstage/plugin-tech-insights-node';
import { FactRetrieverRegistry } from './FactRetrieverRegistry';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { Duration } from 'luxon';
export declare class FactRetrieverEngine {
    private readonly repository;
    private readonly factRetrieverRegistry;
    private readonly factRetrieverContext;
    private readonly logger;
    private readonly scheduler;
    private readonly defaultCadence?;
    private readonly defaultTimeout?;
    private constructor();
    static create(options: {
        repository: TechInsightsStore;
        factRetrieverRegistry: FactRetrieverRegistry;
        factRetrieverContext: FactRetrieverContext;
        scheduler: PluginTaskScheduler;
        defaultCadence?: string;
        defaultTimeout?: Duration;
    }): Promise<FactRetrieverEngine>;
    schedule(): Promise<void>;
    getJobRegistration(ref: string): FactRetrieverRegistration;
    triggerJob(ref: string): Promise<void>;
    private createFactRetrieverHandler;
}
