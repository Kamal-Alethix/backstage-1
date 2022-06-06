/// <reference types="react" />
export declare type FossaPageProps = {
    entitiesFilter?: Record<string, string | symbol | (string | symbol)[]>[] | Record<string, string | symbol | (string | symbol)[]> | undefined;
};
export declare const FossaPage: ({ entitiesFilter, }: FossaPageProps) => JSX.Element;
