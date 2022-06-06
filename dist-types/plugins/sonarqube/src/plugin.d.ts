/// <reference types="react" />
export declare const sonarQubePlugin: import("@backstage/core-plugin-api").BackstagePlugin<{}, {}>;
export declare const EntitySonarQubeCard: ({ variant, duplicationRatings, }: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
    duplicationRatings?: {
        greaterThan: number;
        rating: "1.0" | "2.0" | "3.0" | "4.0" | "5.0";
    }[] | undefined;
}) => JSX.Element;
