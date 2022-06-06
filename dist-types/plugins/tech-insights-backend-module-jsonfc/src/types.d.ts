import { TopLevelCondition } from 'json-rules-engine';
import { TechInsightCheck } from '@backstage/plugin-tech-insights-node';
import { BooleanCheckResult, CheckResponse } from '@backstage/plugin-tech-insights-common';
/**
 * @public
 */
export declare type Rule = {
    conditions: TopLevelCondition;
    name?: string;
    priority?: number;
};
/**
 * @public
 */
export interface TechInsightJsonRuleCheck extends TechInsightCheck {
    rule: Rule;
}
/**
 * @public
 */
export declare type CheckCondition = {
    operator: string;
    fact: string;
    factValue: any;
    factResult: any;
    result: boolean;
};
/**
 * @public
 */
export declare type ResponseTopLevelCondition = {
    all: CheckCondition[];
} | {
    any: CheckCondition[];
};
/**
 * @public
 */
export interface JsonRuleCheckResponse extends CheckResponse {
    rule: {
        conditions: ResponseTopLevelCondition & {
            priority: number;
        };
    };
}
/**
 * @public
 */
export interface JsonRuleBooleanCheckResult extends BooleanCheckResult {
    check: JsonRuleCheckResponse;
}
