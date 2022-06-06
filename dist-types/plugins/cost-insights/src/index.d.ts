/**
 * A Backstage plugin that helps you keep track of your cloud spend
 *
 * @packageDocumentation
 */
export { costInsightsPlugin, costInsightsPlugin as plugin, CostInsightsPage, CostInsightsProjectGrowthInstructionsPage, CostInsightsLabelDataflowInstructionsPage, } from './plugin';
export { ExampleCostInsightsClient } from './example';
export { BarChart, BarChartLegend, BarChartTooltip, BarChartTooltipItem, CostGrowth, CostGrowthIndicator, LegendItem, } from './components';
export { MockConfigProvider, MockCurrencyProvider } from './testUtils';
export * from './api';
export * from './alerts';
export * from './types';
export type { BarChartProps, BarChartLegendOptions, BarChartLegendProps, BarChartTooltipProps, BarChartTooltipItemProps, CostGrowthProps, CostGrowthIndicatorProps, TooltipItem, LegendItemProps, } from './components';
