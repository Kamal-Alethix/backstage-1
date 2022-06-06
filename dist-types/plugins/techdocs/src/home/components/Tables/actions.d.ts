/// <reference types="react" />
import { DocsTableRow } from './types';
/**
 * Not directly exported, but through DocsTable.actions and EntityListDocsTable.actions
 *
 * @public
 */
export declare const actionFactories: {
    createCopyDocsUrlAction(copyToClipboard: Function): (row: DocsTableRow) => {
        icon: () => JSX.Element;
        tooltip: string;
        onClick: () => any;
    };
    createStarEntityAction(isStarredEntity: Function, toggleStarredEntity: Function): ({ entity }: DocsTableRow) => {
        cellStyle: {
            paddingLeft: string;
        };
        icon: () => JSX.Element;
        tooltip: string;
        onClick: () => any;
    };
};
