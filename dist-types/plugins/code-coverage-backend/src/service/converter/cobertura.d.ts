import { FileEntry } from '../types';
import { CoberturaXML } from './types';
import { Logger } from 'winston';
import { Converter } from './Converter';
export declare class Cobertura implements Converter {
    readonly logger: Logger;
    constructor(logger: Logger);
    /**
     * convert cobertura into shared json coverage format
     *
     * @param xml - cobertura xml object
     * @param scmFiles - list of files that are committed to SCM
     */
    convert(xml: CoberturaXML, scmFiles: string[]): FileEntry[];
    /**
     * Parses branch coverage information from condition-coverage
     *
     * @param condition - condition-coverage value from line coverage
     */
    private parseBranch;
    /**
     * Extract line hits from a class coverage entry
     *
     * @param clz - class coverage information
     */
    private extractLines;
}
