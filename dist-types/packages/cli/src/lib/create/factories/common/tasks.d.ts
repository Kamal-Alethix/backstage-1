import { CreateContext } from '../../types';
export declare function executePluginPackageTemplate(ctx: CreateContext, options: {
    templateName: string;
    targetDir: string;
    values: Record<string, unknown>;
}): Promise<void>;
