/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare const allurePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityAllureReportContent: () => JSX.Element;

declare const ALLURE_PROJECT_ID_ANNOTATION = "qameta.io/allure-project";
declare const isAllureReportAvailable: (entity: Entity) => boolean;

export { ALLURE_PROJECT_ID_ANNOTATION, EntityAllureReportContent, allurePlugin, isAllureReportAvailable };
