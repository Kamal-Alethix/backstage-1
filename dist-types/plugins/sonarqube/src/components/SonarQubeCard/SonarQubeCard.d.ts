/// <reference types="react" />
import { InfoCardVariants } from '@backstage/core-components';
declare type DuplicationRating = {
    greaterThan: number;
    rating: '1.0' | '2.0' | '3.0' | '4.0' | '5.0';
};
export declare const SonarQubeCard: ({ variant, duplicationRatings, }: {
    variant?: InfoCardVariants | undefined;
    duplicationRatings?: DuplicationRating[] | undefined;
}) => JSX.Element;
export {};
