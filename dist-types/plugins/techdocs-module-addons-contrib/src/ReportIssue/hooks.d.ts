export declare const getTitle: (selection: Selection) => string;
export declare const getBody: (selection: Selection, markdownUrl: string) => string;
export declare const useGitTemplate: (debounceTime?: number | undefined) => {
    title: string;
    body: string;
};
export declare const useGitRepository: () => {
    type: string;
    protocols: string[];
    port: number | null;
    resource: string;
    user: string;
    pathname: string;
    hash: string;
    search: string;
    href: string;
    protocol: string;
    token: string;
    source: string;
    owner: string;
    name: string;
    ref: string;
    filepath: string;
    filepathtype: string;
    full_name: string;
    organization: string;
    git_suffix?: boolean | undefined;
    toString(type?: string | undefined): string;
} | null;
