import { Website, LighthouseCategoryId } from './api';
export declare function useQuery(): URLSearchParams;
export declare function formatTime(timestamp: string | Date): string;
export declare const CATEGORIES: LighthouseCategoryId[];
export declare const CATEGORY_LABELS: Record<LighthouseCategoryId, string>;
export declare type SparklinesDataByCategory = Record<LighthouseCategoryId, number[]>;
export declare function buildSparklinesDataForItem(item: Website): SparklinesDataByCategory;
