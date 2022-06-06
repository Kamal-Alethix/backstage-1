import express from 'express';
import { Config } from '@backstage/config';
import { FactChecker, TechInsightCheck } from '@backstage/plugin-tech-insights-node';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Logger } from 'winston';
import { PersistenceContext } from './persistence/persistenceContext';
/**
 * @public
 *
 * RouterOptions to construct TechInsights endpoints
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 */
export interface RouterOptions<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> {
    /**
     * Optional FactChecker implementation. If omitted, endpoints are not constructed
     */
    factChecker?: FactChecker<CheckType, CheckResultType>;
    /**
     * TechInsights PersistenceContext. Should contain an implementation of TechInsightsStore
     */
    persistenceContext: PersistenceContext;
    /**
     * Backstage config object
     */
    config: Config;
    /**
     * Implementation of Winston logger
     */
    logger: Logger;
}
/**
 * @public
 *
 * Constructs a tech-insights router.
 *
 * Exposes endpoints to handle facts
 * Exposes optional endpoints to handle checks if a FactChecker implementation is passed in
 *
 * @param options - RouterOptions object
 */
export declare function createRouter<CheckType extends TechInsightCheck, CheckResultType extends CheckResult>(options: RouterOptions<CheckType, CheckResultType>): Promise<express.Router>;
