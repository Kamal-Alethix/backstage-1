export declare type CoberturaXML = {
    coverage: Coverage;
};
export declare type Coverage = {
    packages: Array<Package>;
    package: Array<InnerPackage>;
};
export declare type Package = {
    package: Array<InnerPackage>;
};
export declare type InnerPackage = {
    classes: Array<Class>;
};
export declare type Class = {
    class: Array<InnerClass>;
};
export declare type InnerClass = {
    $: {
        filename: string;
    };
    lines: Array<Line>;
    methods: Array<Method>;
};
export declare type Method = {
    method: Array<InnerMethod>;
};
export declare type InnerMethod = {
    lines: Array<Line>;
};
export declare type Line = {
    line: Array<InnerLine>;
};
export declare type InnerLine = {
    $: LineHit;
};
export declare type LineHit = {
    branch?: boolean;
    'condition-coverage'?: string;
    number: number;
    hits: number;
};
export declare type JacocoXML = {
    report: JacocoReport;
};
export declare type JacocoReport = {
    package: JacocoPackage[];
};
export declare type JacocoPackage = {
    $: {
        name: string;
    };
    sourcefile: JacocoSourceFile[];
};
export declare type JacocoSourceFile = {
    $: {
        name: string;
    };
    line: JacocoLine[] | undefined;
};
export declare type JacocoLine = {
    $: {
        nr: string;
        mi: string;
        ci: string;
        mb: string;
        cb: string;
    };
};
