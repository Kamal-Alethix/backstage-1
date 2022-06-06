/// <reference types="react" />
import * as _backstage_core_components from '@backstage/core-components';
import { InfoCardVariants } from '@backstage/core-components';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';

declare const lighthousePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const LighthousePage: () => JSX.Element;
declare const EntityLighthouseContent: (_props: {}) => JSX.Element;
declare const EntityLastLighthouseAuditCard: ({ dense, variant, }: {
    dense?: boolean | undefined;
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;

declare const isLighthouseAvailable: (entity: Entity) => boolean;
declare const Router: () => JSX.Element;
declare type Props = {};
declare const EmbeddedRouter: (_props: Props) => JSX.Element;

declare type LighthouseCategoryId = 'pwa' | 'seo' | 'performance' | 'accessibility' | 'best-practices';
interface LighthouseCategoryAbbr {
    id: LighthouseCategoryId;
    score: number;
    title: string;
}
interface LASListRequest {
    offset?: number;
    limit?: number;
}
interface LASListResponse<Item> {
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
interface AuditRunning extends AuditBase {
    status: 'RUNNING';
}
interface AuditFailed extends AuditBase {
    status: 'FAILED';
    timeCompleted: string;
}
interface AuditCompleted extends AuditBase {
    status: 'COMPLETED';
    timeCompleted: string;
    report: Object;
    categories: Record<LighthouseCategoryId, LighthouseCategoryAbbr>;
}
declare type Audit = AuditRunning | AuditFailed | AuditCompleted;
interface Website {
    url: string;
    audits: Audit[];
    lastAudit: Audit;
}
declare type WebsiteListResponse = LASListResponse<Website>;
interface TriggerAuditPayload {
    url: string;
    options: {
        lighthouseConfig: {
            settings: {
                emulatedFormFactor: string;
            };
        };
    };
}
declare class FetchError extends Error {
    get name(): string;
    static forResponse(resp: Response): Promise<FetchError>;
}
declare type LighthouseApi = {
    url: string;
    getWebsiteList: (listOptions: LASListRequest) => Promise<WebsiteListResponse>;
    getWebsiteForAuditId: (auditId: string) => Promise<Website>;
    triggerAudit: (payload: TriggerAuditPayload) => Promise<Audit>;
    getWebsiteByUrl: (websiteUrl: string) => Promise<Website>;
};
declare const lighthouseApiRef: _backstage_core_plugin_api.ApiRef<LighthouseApi>;
declare class LighthouseRestApi implements LighthouseApi {
    url: string;
    static fromConfig(config: Config): LighthouseRestApi;
    constructor(url: string);
    private fetch;
    getWebsiteList({ limit, offset, }?: LASListRequest): Promise<WebsiteListResponse>;
    getWebsiteForAuditId(auditId: string): Promise<Website>;
    triggerAudit(payload: TriggerAuditPayload): Promise<Audit>;
    getWebsiteByUrl(websiteUrl: string): Promise<Website>;
}

declare const LastLighthouseAuditCard: ({ dense, variant, }: {
    dense?: boolean | undefined;
    variant?: InfoCardVariants | undefined;
}) => JSX.Element;

export { Audit, AuditCompleted, AuditFailed, AuditRunning, EmbeddedRouter, EntityLastLighthouseAuditCard, EntityLighthouseContent, FetchError, LASListRequest, LASListResponse, LastLighthouseAuditCard, LighthouseApi, LighthouseCategoryAbbr, LighthouseCategoryId, LighthousePage, LighthouseRestApi, Router, TriggerAuditPayload, Website, WebsiteListResponse, isLighthouseAvailable, isLighthouseAvailable as isPluginApplicableToEntity, lighthouseApiRef, lighthousePlugin, lighthousePlugin as plugin };
