import { Logger } from 'winston';
import { KubernetesAuthTranslator } from './types';
export declare class KubernetesAuthTranslatorGenerator {
    static getKubernetesAuthTranslatorInstance(authProvider: string, options: {
        logger: Logger;
    }): KubernetesAuthTranslator;
}
