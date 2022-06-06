/// <reference types="react" />
import { AdrFilePathFilterFn } from '@backstage/plugin-adr-common';
import { AdrContentDecorator } from '../AdrReader';
/**
 * Component for browsing ADRs on an entity page.
 * @public
 */
export declare const EntityAdrContent: ({ contentDecorators, filePathFilterFn, }: {
    contentDecorators?: AdrContentDecorator[] | undefined;
    filePathFilterFn?: AdrFilePathFilterFn | undefined;
}) => JSX.Element;
