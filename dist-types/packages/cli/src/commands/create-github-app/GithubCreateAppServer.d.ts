declare type GithubAppConfig = {
    appId: number;
    slug?: string;
    name?: string;
    webhookUrl?: string;
    clientId: string;
    clientSecret: string;
    webhookSecret: string;
    privateKey: string;
};
export declare class GithubCreateAppServer {
    private readonly actionUrl;
    private readonly readWrite;
    private baseUrl?;
    private webhookUrl?;
    static run(options: {
        org: string;
        readWrite: boolean;
    }): Promise<GithubAppConfig>;
    private constructor();
    private start;
    private formHandler;
    private listen;
}
export {};
