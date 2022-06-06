declare enum Webpacker {
    react = "react",
    vue = "vue",
    angular = "angular",
    elm = "elm",
    stimulus = "stimulus"
}
declare enum Database {
    mysql = "mysql",
    postgresql = "postgresql",
    sqlite3 = "sqlite3",
    oracle = "oracle",
    sqlserver = "sqlserver",
    jdbcmysql = "jdbcmysql",
    jdbcsqlite3 = "jdbcsqlite3",
    jdbcpostgresql = "jdbcpostgresql",
    jdbc = "jdbc"
}
declare enum RailsVersion {
    dev = "dev",
    edge = "edge",
    master = "master",
    fromImage = "fromImage"
}
export declare type RailsRunOptions = {
    minimal?: boolean;
    api?: boolean;
    template?: string;
    webpacker?: Webpacker;
    database?: Database;
    railsVersion?: RailsVersion;
    skipBundle?: boolean;
    skipWebpackInstall?: boolean;
    skipTest?: boolean;
    force?: boolean;
};
export declare const railsArgumentResolver: (projectRoot: string, options: RailsRunOptions, executionOnContainer?: boolean) => string[];
export {};
