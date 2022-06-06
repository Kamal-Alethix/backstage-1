import { FileDiff } from './types';
export declare type TemplatedFile = {
    path: string;
    contents: string;
};
export declare function diffTemplateFiles(template: string, templateData: any): Promise<FileDiff[]>;
