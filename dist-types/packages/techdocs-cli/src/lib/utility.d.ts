import { ParsedLocationAnnotation } from '@backstage/plugin-techdocs-node';
import * as winston from 'winston';
export declare const convertTechDocsRefToLocationAnnotation: (techdocsRef: string) => ParsedLocationAnnotation;
export declare const createLogger: ({ verbose, }: {
    verbose: boolean;
}) => winston.Logger;
