import React, { ComponentType } from 'react';
import { Entity } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
/**
 * The props for the entrypoint `ScaffolderPage` component the plugin.
 * @public
 */
export declare type RouterProps = {
    components?: {
        TemplateCardComponent?: ComponentType<{
            template: TemplateEntityV1beta3;
        }> | undefined;
        TaskPageComponent?: ComponentType<{}>;
    };
    groups?: Array<{
        title?: React.ReactNode;
        filter: (entity: Entity) => boolean;
    }>;
    defaultPreviewTemplate?: string;
    /**
     * Options for the context menu on the scaffolder page.
     */
    contextMenu?: {
        /** Whether to show a link to the template editor */
        editor?: boolean;
        /** Whether to show a link to the actions documentation */
        actions?: boolean;
    };
};
/**
 * The main entrypoint `Router` for the `ScaffolderPlugin`.
 *
 * @public
 */
export declare const Router: (props: RouterProps) => JSX.Element;
