import { EntityFilter } from '../../catalog';
/**
 * Forms a full EntityFilter based on a single key-value(s) object.
 */
export declare function basicEntityFilter(items: Record<string, string | string[]>): EntityFilter;
