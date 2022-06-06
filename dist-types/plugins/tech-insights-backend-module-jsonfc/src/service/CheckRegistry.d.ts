import { TechInsightCheck, TechInsightCheckRegistry } from '@backstage/plugin-tech-insights-node';
export declare class DefaultCheckRegistry<CheckType extends TechInsightCheck> implements TechInsightCheckRegistry<CheckType> {
    private readonly checks;
    constructor(checks: CheckType[]);
    register(check: CheckType): Promise<CheckType>;
    get(checkId: string): Promise<CheckType>;
    getAll(checks: string[]): Promise<CheckType[]>;
    list(): Promise<CheckType[]>;
}
