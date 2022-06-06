import { FactLifecycle, FactRetriever, FactRetrieverRegistration } from '@backstage/plugin-tech-insights-node';
/**
 * @public
 *
 * @param cadence - cron expression to indicate when the fact retriever should be triggered
 * @param factRetriever - Implementation of fact retriever consisting of at least id, version, schema and handler
 * @param lifecycle - Optional lifecycle definition indicating the cleanup logic of facts when this retriever is run
 *
 */
export declare type FactRetrieverRegistrationOptions = {
    cadence: string;
    factRetriever: FactRetriever;
    lifecycle?: FactLifecycle;
};
/**
 * @public
 *
 * A helper function to construct fact retriever registrations.
 *
 * @param cadence - cron expression to indicate when the fact retriever should be triggered
 * @param factRetriever - Implementation of fact retriever consisting of at least id, version, schema and handler
 * @param lifecycle - Optional lifecycle definition indicating the cleanup logic of facts when this retriever is run
 *
 *
 * @remarks
 *
 * Cron expressions help:
 * ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 *
 * Valid lifecycle values:
 * \{ ttl: \{ weeks: 2 \} \} -- This fact retriever will remove items that are older than 2 weeks when it is run
 * \{ maxItems: 7 \} -- This fact retriever will leave 7 newest items in the database when it is run
 *
 */
export declare function createFactRetrieverRegistration(options: FactRetrieverRegistrationOptions): FactRetrieverRegistration;
