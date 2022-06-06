import { AnsiLine } from './AnsiProcessor';
export declare function applySearchFilter(lines: AnsiLine[], searchText: string): {
    lines: AnsiLine[];
    results?: undefined;
} | {
    lines: AnsiLine[];
    results: {
        lineNumber: number;
        lineIndex: number;
    }[];
};
export interface LogViewerSearch {
    lines: AnsiLine[];
    searchText: string;
    searchInput: string;
    setSearchInput: (searchInput: string) => void;
    shouldFilter: boolean;
    toggleShouldFilter: () => void;
    resultCount: number | undefined;
    resultIndex: number | undefined;
    resultIndexStep: (decrement?: boolean) => void;
    resultLine: number | undefined;
    resultLineIndex: number | undefined;
}
export declare function useLogViewerSearch(lines: AnsiLine[]): LogViewerSearch;
