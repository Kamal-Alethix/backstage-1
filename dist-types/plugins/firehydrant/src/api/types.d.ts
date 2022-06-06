import { Incident, Service } from '../components/types';
export declare type ServiceDetailsResponse = {
    service?: Service;
    incidents?: ServiceIncidentsResponse;
};
export declare type ServiceAnalyticsResponse = {
    id: string;
    mttd?: number;
    mtta?: number;
    mttm?: number;
    mttr?: number;
    count: number;
    total_time: number;
};
export declare type ServiceIncidentsResponse = Incident[];
