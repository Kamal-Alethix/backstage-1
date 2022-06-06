import { UrlReader } from '@backstage/backend-common';
import { ScmIntegration } from '@backstage/integration';
import 'core-js/features/promise';
export declare function readCodeOwners(reader: UrlReader, sourceUrl: string, codeownersPaths: string[]): Promise<string | undefined>;
export declare function findCodeOwnerByTarget(reader: UrlReader, targetUrl: string, scmIntegration: ScmIntegration): Promise<string | undefined>;
