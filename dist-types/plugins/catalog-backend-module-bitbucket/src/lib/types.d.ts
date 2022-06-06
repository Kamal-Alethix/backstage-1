declare type BitbucketRepositoryBase = {
    project: {
        key: string;
    };
    slug: string;
};
export declare type BitbucketRepository = BitbucketRepositoryBase & {
    links: Record<string, {
        href: string;
    }[]>;
};
export {};
