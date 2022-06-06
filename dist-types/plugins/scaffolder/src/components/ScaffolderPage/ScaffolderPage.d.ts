import { Entity } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import React, { ComponentType } from 'react';
export declare type ScaffolderPageProps = {
    TemplateCardComponent?: ComponentType<{
        template: TemplateEntityV1beta3;
    }> | undefined;
    groups?: Array<{
        title?: React.ReactNode;
        filter: (entity: Entity) => boolean;
    }>;
    contextMenu?: {
        editor?: boolean;
        actions?: boolean;
        tasks?: boolean;
    };
};
export declare const ScaffolderPageContents: ({ TemplateCardComponent, groups, contextMenu, }: ScaffolderPageProps) => JSX.Element;
export declare const ScaffolderPage: ({ TemplateCardComponent, groups, }: ScaffolderPageProps) => JSX.Element;
