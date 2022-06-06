import { FileEntry } from '../types';
import { JacocoXML } from './types';
import { Logger } from 'winston';
import { Converter } from './Converter';
export declare class Jacoco implements Converter {
    readonly logger: Logger;
    constructor(logger: Logger);
    /**
     * Converts jacoco into shared json coverage format
     *
     * @param xml - jacoco xml object
     * @param scmFiles - list of files that are committed to SCM
     */
    convert(xml: JacocoXML, scmFiles: Array<string>): Array<FileEntry>;
    private extractLines;
}
