import { Duration, Group, PageFilters } from '../types';
import { ConfigContextProps } from '../hooks/useConfig';
export declare const stringify: (queryParams: Partial<PageFilters>) => string;
export declare const parse: (queryString: string) => Partial<PageFilters>;
export declare const validate: (queryString: string) => Promise<PageFilters>;
export declare const getInitialPageState: (groups: Group[], queryParams?: Partial<PageFilters>) => {
    group: import("../types").Maybe<string>;
    project: import("../types").Maybe<string>;
    duration: Duration;
    metric: string | null;
};
export declare const getInitialProductState: (config: ConfigContextProps) => {
    productType: string;
    duration: Duration;
}[];
