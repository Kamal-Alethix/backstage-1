export declare function startPostgresContainer(image: string): Promise<{
    host: string;
    port: number;
    user: string;
    password: string;
    stop: () => Promise<void>;
}>;
