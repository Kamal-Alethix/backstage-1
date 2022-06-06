export declare class Task {
    static log(name?: string): void;
    static error(message?: string): void;
    static section(name: string): void;
    static exit(code?: number): void;
    static forItem<T = void>(task: string, item: string, taskFunc: () => Promise<T>): Promise<T>;
    static forCommand(command: string, options?: {
        cwd?: string;
        optional?: boolean;
    }): Promise<void>;
}
export declare function templatingTask(templateDir: string, destinationDir: string, context: any, versionProvider: (name: string, versionHint?: string) => string): Promise<void>;
export declare function addPackageDependency(path: string, options: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
}): Promise<void>;
