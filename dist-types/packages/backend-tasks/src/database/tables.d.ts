export declare const DB_MIGRATIONS_TABLE = "backstage_backend_tasks__knex_migrations";
export declare const DB_TASKS_TABLE = "backstage_backend_tasks__tasks";
export declare type DbTasksRow = {
    id: string;
    settings_json: string;
    next_run_start_at: Date;
    current_run_ticket?: string;
    current_run_started_at?: Date | string;
    current_run_expires_at?: Date | string;
};
