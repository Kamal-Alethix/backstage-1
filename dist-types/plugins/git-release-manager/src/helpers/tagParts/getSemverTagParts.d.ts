import { AlertError } from '../../types/types';
export declare type SemverTagParts = {
    prefix: string;
    major: number;
    minor: number;
    patch: number;
};
export declare const semverRegexp: RegExp;
export declare function getSemverTagParts(tag: string): {
    error: AlertError;
    tagParts?: undefined;
} | {
    tagParts: SemverTagParts;
    error?: undefined;
};
