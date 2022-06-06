import { DistinctQuestion } from 'inquirer';
export interface CreateContext {
    /** The package scope to use for new packages */
    scope?: string;
    /** The NPM registry to use for new packages */
    npmRegistry?: string;
    /** Whether new packages should be marked as private */
    private: boolean;
    /** Whether we are creating something in a monorepo or not */
    isMonoRepo: boolean;
    /** The default version to use for new packages */
    defaultVersion: string;
    /** Creates a temporary directory. This will always be deleted after creation is done. */
    createTemporaryDirectory(name: string): Promise<string>;
    /** Signal that the creation process got to a point where permanent modifications were made */
    markAsModified(): void;
}
export declare type AnyOptions = Record<string, string>;
export declare type Prompt<TOptions> = DistinctQuestion<TOptions> & {
    name: string;
};
export interface Factory<TOptions extends AnyOptions> {
    /**
     * The name used for this factory.
     */
    name: string;
    /**
     * A description that describes what this factory creates to the user.
     */
    description: string;
    /**
     * An optional options discovery step that is run
     * before the prompts to potentially fill in some of the options.
     */
    optionsDiscovery?(): Promise<Partial<TOptions>>;
    /**
     * Inquirer prompts that will be filled in either interactively or
     * through command line arguments.
     */
    optionsPrompts?: ReadonlyArray<Prompt<TOptions>>;
    /**
     * The main method of the factory that handles creation.
     */
    create(options: TOptions, context?: CreateContext): Promise<void>;
}
export declare type AnyFactory = Factory<AnyOptions>;
export declare function createFactory<TOptions extends AnyOptions>(config: Factory<TOptions>): AnyFactory;
