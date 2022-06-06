export declare function startMysqlContainer(image: string): Promise<{
    host: string;
    port: number;
    user: string;
    password: string;
    stop: () => Promise<void>;
}>;
