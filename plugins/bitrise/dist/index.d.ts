/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare const bitrisePlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;

declare const EntityBitriseContent: () => JSX.Element;

declare const isBitriseAvailable: (entity: Entity) => boolean;

export { EntityBitriseContent, bitrisePlugin, isBitriseAvailable };
