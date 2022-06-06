import { useLocation } from 'react-router';
import { Project } from '../contexts/ProjectContext';
export declare function useQueryHandler(): {
    getParsedQuery: () => {
        parsedQuery: Partial<Project>;
    };
    getQueryParamsWithUpdates: ({ updates, }: {
        updates: {
            key: keyof Project;
            value: string;
        }[];
    }) => {
        queryParams: string;
    };
};
declare function getDecodedSearch(location: ReturnType<typeof useLocation>): {
    decodedSearch: string;
};
export declare const testables: {
    getDecodedSearch: typeof getDecodedSearch;
};
export {};
