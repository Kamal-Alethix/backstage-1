export declare type DashboardEntity = {
    data: {
        actor: {
            entitySearch: {
                results: {
                    entities: Array<ResultEntity>;
                };
            };
        };
    };
};
export declare type ResultEntity = {
    dashboardParentGuid: string;
    guid: string;
    permalink: string;
    name: string;
};
