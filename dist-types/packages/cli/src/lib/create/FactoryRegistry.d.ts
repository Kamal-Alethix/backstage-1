import { AnyFactory } from './types';
export declare class FactoryRegistry {
    private static factoryMap;
    static interactiveSelect(preselected?: string): Promise<AnyFactory>;
    static populateOptions(factory: AnyFactory, provided: Record<string, string>): Promise<Record<string, string>>;
}
