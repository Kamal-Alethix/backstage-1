import { Knex } from 'knex';
export declare function initDatabaseMetrics(knex: Knex): {
    entities_count: import("prom-client").Gauge<"kind">;
    registered_locations: import("prom-client").Gauge<string>;
    relations: import("prom-client").Gauge<string>;
};
