/// <reference types="react" />
import * as _backstage_core_components from '@backstage/core-components';
import { InfoCardVariants } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare type DuplicationRating = {
    greaterThan: number;
    rating: '1.0' | '2.0' | '3.0' | '4.0' | '5.0';
};
declare const SonarQubeCard: ({ variant, duplicationRatings, }: {
    variant?: InfoCardVariants | undefined;
    duplicationRatings?: DuplicationRating[] | undefined;
}) => JSX.Element;

declare const isSonarQubeAvailable: (entity: Entity) => boolean;

declare const sonarQubePlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
declare const EntitySonarQubeCard: ({ variant, duplicationRatings, }: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
    duplicationRatings?: {
        greaterThan: number;
        rating: "1.0" | "2.0" | "3.0" | "4.0" | "5.0";
    }[] | undefined;
}) => JSX.Element;

export { EntitySonarQubeCard, SonarQubeCard, isSonarQubeAvailable, sonarQubePlugin as plugin, sonarQubePlugin };
