/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { InfoCardVariants } from '@backstage/core-components';
import { Options } from '@material-table/core';
export declare const SentryIssuesWidget: ({ entity, statsFor, tableOptions, variant, query, }: {
    entity: Entity;
    statsFor: '24h' | '14d' | '';
    tableOptions: Options<never>;
    variant?: InfoCardVariants | undefined;
    query?: string | undefined;
}) => JSX.Element;
