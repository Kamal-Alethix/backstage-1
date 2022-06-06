export declare type AnsiColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'grey';
export interface ChunkModifiers {
    foreground?: AnsiColor;
    background?: AnsiColor;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}
export interface AnsiChunk {
    text: string;
    modifiers: ChunkModifiers;
}
export declare class AnsiLine {
    readonly lineNumber: number;
    readonly chunks: AnsiChunk[];
    text: string;
    constructor(lineNumber?: number, chunks?: AnsiChunk[]);
    lastChunk(): AnsiChunk | undefined;
    replaceLastChunk(newChunks?: AnsiChunk[]): void;
}
export declare class AnsiProcessor {
    private text;
    private lines;
    /**
     * Processes a chunk of text while keeping internal state that optimizes
     * subsequent processing that appends to the text.
     */
    process(text: string): AnsiLine[];
    private processLines;
    private processText;
    private processCode;
}
