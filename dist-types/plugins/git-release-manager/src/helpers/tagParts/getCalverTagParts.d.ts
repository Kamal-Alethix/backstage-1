import { AlertError } from '../../types/types';
export declare type CalverTagParts = {
    prefix: string;
    calver: string;
    patch: number;
};
export declare const calverRegexp: RegExp;
export declare function getCalverTagParts(tag: string): {
    error: AlertError;
    tagParts?: undefined;
} | {
    tagParts: CalverTagParts;
    error?: undefined;
};
