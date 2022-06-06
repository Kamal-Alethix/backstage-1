import { FileEntry } from '../types';
export interface Converter {
    convert(xml: unknown, scmFiles: Array<string>): Array<FileEntry>;
}
