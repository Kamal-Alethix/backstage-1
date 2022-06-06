declare type Data = {
    dependencies: Array<{
        target: string;
        type: 'dependencies';
        name: string;
        query: string;
    }>;
};
export declare const dependencies: import("../types").StepDefinition<Data>;
export {};
