import { TechRadarLoaderResponse, TechRadarApi } from './api';
export declare const mock: TechRadarLoaderResponse;
export declare class SampleTechRadarApi implements TechRadarApi {
    load(): Promise<TechRadarLoaderResponse>;
}
