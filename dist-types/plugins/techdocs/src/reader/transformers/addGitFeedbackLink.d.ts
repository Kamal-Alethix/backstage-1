import type { Transformer } from './index';
import { ScmIntegrationRegistry } from '@backstage/integration';
export declare const addGitFeedbackLink: (scmIntegrationsApi: ScmIntegrationRegistry) => Transformer;
