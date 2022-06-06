import { AnsiLine } from './AnsiProcessor';
export declare function useLogViewerSelection(lines: AnsiLine[]): {
    shouldShowButton(line: number): boolean;
    isSelected(line: number): boolean;
    setSelection(line: number, add: boolean): void;
    copySelection(): void;
};
