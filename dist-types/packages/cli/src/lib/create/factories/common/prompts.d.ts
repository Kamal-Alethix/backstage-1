import { Prompt } from '../../types';
export declare function pluginIdPrompt(): Prompt<{
    id: string;
}>;
export declare function ownerPrompt(): Prompt<{
    owner?: string;
    codeOwnersPath?: string;
}>;
