import { FactRetriever, FactRetrieverRegistration, FactSchema } from '@backstage/plugin-tech-insights-node';
export declare class FactRetrieverRegistry {
    private readonly retrievers;
    constructor(retrievers: FactRetrieverRegistration[]);
    register(registration: FactRetrieverRegistration): void;
    get(retrieverReference: string): FactRetrieverRegistration;
    listRetrievers(): FactRetriever[];
    listRegistrations(): FactRetrieverRegistration[];
    getSchemas(): FactSchema[];
}
