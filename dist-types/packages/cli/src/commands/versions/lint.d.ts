import { OptionValues } from 'commander';
export declare const includedFilter: (name: string) => boolean;
export declare const forbiddenDuplicatesFilter: (name: string) => boolean;
declare const _default: (cmd: OptionValues) => Promise<void>;
export default _default;
