import { Config } from '@backstage/config';
export declare type LighthouseCategoryId = 'pwa' | 'seo' | 'performance' | 'accessibility' | 'best-practices';
export interface LighthouseCategoryAbbr {
    id: LighthouseCategoryId;
    score: number;
    title: string;
}
export interface LASListRequest {
    offset?: number;
    limit?: number;
}
export interface LASListResponse<Item> {
    items: Item[];
    total: number;
    offset: number;
    limit: number;
}
interface AuditBase {
    id: string;
    url: string;
    timeCreated: string;
}
export interface AuditRunning extends AuditBase {
    status: 'RUNNING';
}
export interface AuditFailed extends AuditBase {
    status: 'FAILED';
    timeCompleted: string;
}
export interface AuditCompleted extends AuditBase {
    status: 'COMPLETED';
    timeCompleted: string;
    report: Object;
    categories: Record<LighthouseCategoryId, LighthouseCategoryAbbr>;
}
export declare type Audit = AuditRunning | AuditFailed | AuditCompleted;
export interface Website {
    url: string;
    audits: Audit[];
    lastAudit: Audit;
}
export declare type WebsiteListResponse = LASListResponse<Website>;
export interface TriggerAuditPayload {
    url: string;
    options: {
        lighthouseConfig: {
            settings: {
                emulatedFormFactor: string;
            };
        };
    };
}
export declare class FetchError extends Error {
    get name(): string;
    static forResponse(resp: Response): Promise<FetchError>;
}
export declare type LighthouseApi = {
    url: string;
    getWebsiteList: (listOptions: LASListRequest) => Promise<WebsiteListResponse>;
    getWebsiteForAuditId: (auditId: string) => Promise<Website>;
    triggerAudit: (payload: TriggerAuditPayload) => Promise<Audit>;
    getWebsiteByUrl: (websiteUrl: string) => Promise<Website>;
};
export declare const lighthouseApiRef: import("@backstage/core-plugin-api").ApiRef<LighthouseApi>;
export declare class LighthouseRestApi implements LighthouseApi {
    url: string;
    static fromConfig(config: Config): LighthouseRestApi;
    constructor(url: string);
    private fetch;
    getWebsiteList({ limit, offset, }?: LASListRequest): Promise<WebsiteListResponse>;
    getWebsiteForAuditId(auditId: string): Promise<Website>;
    triggerAudit(payload: TriggerAuditPayload): Promise<Audit>;
    getWebsiteByUrl(websiteUrl: string): Promise<Website>;
}
export {};
