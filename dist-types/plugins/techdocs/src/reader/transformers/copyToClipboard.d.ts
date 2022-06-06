import { Theme } from '@material-ui/core';
import type { Transformer } from './transformer';
/**
 * Recreates copy-to-clipboard functionality attached to <code> snippets that
 * is native to mkdocs-material theme.
 */
export declare const copyToClipboard: (theme: Theme) => Transformer;
