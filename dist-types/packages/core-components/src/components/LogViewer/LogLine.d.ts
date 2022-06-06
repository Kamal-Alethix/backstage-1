/// <reference types="react" />
import { AnsiChunk, AnsiLine, ChunkModifiers } from './AnsiProcessor';
import { useStyles } from './styles';
export declare function getModifierClasses(classes: ReturnType<typeof useStyles>, modifiers: ChunkModifiers): string | undefined;
export declare function findSearchResults(text: string, searchText: string): {
    start: number;
    end: number;
}[] | undefined;
export interface HighlightAnsiChunk extends AnsiChunk {
    highlight?: number;
}
export declare function calculateHighlightedChunks(line: AnsiLine, searchText: string): HighlightAnsiChunk[];
export interface LogLineProps {
    line: AnsiLine;
    classes: ReturnType<typeof useStyles>;
    searchText: string;
    highlightResultIndex?: number;
}
export declare function LogLine({ line, classes, searchText, highlightResultIndex, }: LogLineProps): JSX.Element;
