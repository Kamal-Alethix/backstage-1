/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { ForwardRefExoticComponent, RefAttributes, PropsWithChildren, ReactNode, Dispatch, SetStateAction } from 'react';
import { BackstagePalette, BackstageTheme } from '@backstage/theme';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { ContentRenderer, TooltipProps, RechartsFunction } from 'recharts';
import { TypographyProps } from '@material-ui/core';

declare const costInsightsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
    growthAlerts: _backstage_core_plugin_api.RouteRef<undefined>;
    unlabeledDataflowAlerts: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const CostInsightsPage: () => JSX.Element;
declare const CostInsightsProjectGrowthInstructionsPage: () => JSX.Element;
declare const CostInsightsLabelDataflowInstructionsPage: () => JSX.Element;

interface ChangeStatistic {
    ratio?: number;
    amount: number;
}
declare const EngineerThreshold = 0.5;
declare enum ChangeThreshold {
    upper = 0.05,
    lower = -0.05
}
declare enum GrowthType {
    Negligible = 0,
    Savings = 1,
    Excess = 2
}

/**
 * Time periods for cost comparison; slight abuse of ISO 8601 periods. We take P3M to mean
 * 'last completed quarter', and P30D/P90D to be '[month|quarter] relative to today'. So if
 * it's September 15, P3M represents costs for Q2 and P30D represents August 16 -
 * September 15.
 */
declare enum Duration {
    P7D = "P7D",
    P30D = "P30D",
    P90D = "P90D",
    P3M = "P3M"
}
declare const DEFAULT_DATE_FORMAT = "yyyy-LL-dd";

declare type Maybe<T> = T | null;

/**
 * Generic alert type with required fields for display. The `element` field will be rendered in
 * the Cost Insights "Action Items" section. This should use data fetched in the CostInsightsApi
 * implementation to render an InfoCard or other visualization.
 *
 * The alert type exposes hooks which can be used to enable and access various events,
 * such as when a user dismisses or snoozes an alert. Default forms and buttons
 * will be rendered if a hook is defined.
 *
 * Each default form can be overridden with a custom component. It must be implemented using
 * React.forwardRef. See https://reactjs.org/docs/forwarding-refs
 *
 * Errors thrown within hooks will generate a snackbar error notification.
 */
declare type Alert = {
    title: string | JSX.Element;
    subtitle: string | JSX.Element;
    element?: JSX.Element;
    status?: AlertStatus;
    url?: string;
    buttonText?: string;
    SnoozeForm?: Maybe<AlertForm>;
    AcceptForm?: Maybe<AlertForm>;
    DismissForm?: Maybe<AlertForm>;
    onSnoozed?(options: AlertOptions): Promise<Alert[]>;
    onAccepted?(options: AlertOptions): Promise<Alert[]>;
    onDismissed?(options: AlertOptions): Promise<Alert[]>;
};
declare type AlertForm<A extends Alert = any, Data = any> = ForwardRefExoticComponent<AlertFormProps<A, Data> & RefAttributes<HTMLFormElement>>;
interface AlertOptions<T = any> {
    data: T;
    group: string;
}
/**
 * Default snooze form intervals are expressed using an ISO 8601 repeating interval string.
 * For example, R1/P7D/2020-09-02 for 1 week or R1/P30D/2020-09-02 for 1 month.
 *
 * For example, if a user dismisses an alert on Monday January 01 for 1 week,
 * it can be re-served on Monday, January 08. 7 calendar days from January 02,
 * inclusive of the last day.
 *
 * https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
 */
interface AlertSnoozeFormData {
    intervals: string;
}
interface AlertDismissFormData {
    other: Maybe<string>;
    reason: AlertDismissReason;
    feedback: Maybe<string>;
}
declare enum AlertStatus {
    Snoozed = "snoozed",
    Accepted = "accepted",
    Dismissed = "dismissed"
}
declare type AlertFormProps<A extends Alert, FormData = {}> = {
    alert: A;
    onSubmit: (data: FormData) => void;
    disableSubmit: (isDisabled: boolean) => void;
};
interface AlertDismissOption {
    label: string;
    reason: string;
}
declare enum AlertDismissReason {
    Other = "other",
    Resolved = "resolved",
    Expected = "expected",
    Seasonal = "seasonal",
    Migration = "migration",
    NotApplicable = "not-applicable"
}
declare const AlertDismissOptions: AlertDismissOption[];
declare type AlertSnoozeOption = {
    label: string;
    duration: Duration;
};
declare const AlertSnoozeOptions: AlertSnoozeOption[];
interface AlertCost {
    id: string;
    aggregation: [number, number];
}
interface ResourceData {
    previous: number;
    current: number;
    name: Maybe<string>;
}
interface BarChartOptions {
    previousFill: string;
    currentFill: string;
    previousName: string;
    currentName: string;
}
/** deprecated use BarChartOptions instead */
interface BarChartData extends BarChartOptions {
}
declare enum DataKey {
    Previous = "previous",
    Current = "current",
    Name = "name"
}
interface ProjectGrowthData {
    project: string;
    periodStart: string;
    periodEnd: string;
    aggregation: [number, number];
    change: ChangeStatistic;
    products: Array<AlertCost>;
}
interface UnlabeledDataflowData {
    periodStart: string;
    periodEnd: string;
    projects: Array<UnlabeledDataflowAlertProject>;
    unlabeledCost: number;
    labeledCost: number;
}
interface UnlabeledDataflowAlertProject {
    id: string;
    unlabeledCost: number;
    labeledCost: number;
}

declare type ChartData = {
    date: number;
    trend: number;
    dailyCost: number;
    [key: string]: number;
};

declare type DateAggregation = {
    date: string;
    amount: number;
};

declare type Trendline = {
    slope: number;
    intercept: number;
};

interface Cost {
    id: string;
    aggregation: DateAggregation[];
    change?: ChangeStatistic;
    trendline?: Trendline;
    groupedCosts?: Record<string, Cost[]>;
}

interface Currency {
    kind: string | null;
    label: string;
    unit: string;
    prefix?: string;
    rate?: number;
}
declare enum CurrencyType {
    USD = "USD",
    CarbonOffsetTons = "CARBON_OFFSET_TONS",
    Beers = "BEERS",
    IceCream = "PINTS_OF_ICE_CREAM"
}

interface Entity {
    id: Maybe<string>;
    aggregation: [number, number];
    entities: Record<string, Entity[]>;
    change: ChangeStatistic;
}

declare type Icon = {
    kind: string;
    component: JSX.Element;
};
declare enum IconType {
    Compute = "compute",
    Data = "data",
    Database = "database",
    Storage = "storage",
    Search = "search",
    ML = "ml"
}

interface PageFilters {
    group: Maybe<string>;
    project: Maybe<string>;
    duration: Duration;
    metric: string | null;
}
declare type ProductFilters = Array<ProductPeriod>;
interface ProductPeriod {
    duration: Duration;
    productType: string;
}

declare type Group = {
    id: string;
};

declare type Loading = Record<string, boolean>;

interface MetricData {
    id: string;
    format: 'number' | 'currency';
    aggregation: DateAggregation[];
    change: ChangeStatistic;
}

declare type Metric = {
    kind: string;
    name: string;
    default: boolean;
};

interface Product {
    kind: string;
    name: string;
}

interface Project {
    id: string;
    name?: string;
}

declare type CostInsightsTooltipOptions = {
    background: string;
    color: string;
};
declare type CostInsightsPaletteAdditions = {
    blue: string;
    lightBlue: string;
    darkBlue: string;
    magenta: string;
    yellow: string;
    tooltip: CostInsightsTooltipOptions;
    navigationText: string;
    alertBackground: string;
    dataViz: string[];
};
declare type CostInsightsPalette = BackstagePalette & CostInsightsPaletteAdditions;
declare type CostInsightsPaletteOptions = PaletteOptions & CostInsightsPaletteAdditions;
interface CostInsightsThemeOptions extends PaletteOptions {
    palette: CostInsightsPaletteOptions;
}
interface CostInsightsTheme extends BackstageTheme {
    palette: CostInsightsPalette;
}

declare type ProductInsightsOptions = {
    /**
     * The product from the cost-insights configuration in app-config.yaml
     */
    product: string;
    /**
     * The group id from getUserGroups or query parameters
     */
    group: string;
    /**
     * An ISO 8601 repeating interval string, such as R2/P3M/2020-09-01
     */
    intervals: string;
    /**
     * (optional) The project id from getGroupProjects or query parameters
     */
    project: Maybe<string>;
};
declare type CostInsightsApi = {
    /**
     * Get the most current date for which billing data is complete, in YYYY-MM-DD format. This helps
     * define the intervals used in other API methods to avoid showing incomplete cost. The costs for
     * today, for example, will not be complete. This ideally comes from the cloud provider.
     */
    getLastCompleteBillingDate(): Promise<string>;
    /**
     * Get a list of groups the given user belongs to. These may be LDAP groups or similar
     * organizational groups. Cost Insights is designed to show costs based on group membership;
     * if a user has multiple groups, they are able to switch between groups to see costs for each.
     *
     * This method should be removed once the Backstage identity plugin provides the same concept.
     *
     * @param userId - The login id for the current user
     */
    getUserGroups(userId: string): Promise<Group[]>;
    /**
     * Get a list of cloud billing entities that belong to this group (projects in GCP, AWS has a
     * similar concept in billing accounts). These act as filters for the displayed costs, users can
     * choose whether they see all costs for a group, or those from a particular owned project.
     *
     * @param group - The group id from getUserGroups or query parameters
     */
    getGroupProjects(group: string): Promise<Project[]>;
    /**
     * Get daily cost aggregations for a given group and interval time frame.
     *
     * The return type includes an array of daily cost aggregations as well as statistics about the
     * change in cost over the intervals. Calculating these statistics requires us to bucket costs
     * into two or more time periods, hence a repeating interval format rather than just a start and
     * end date.
     *
     * The rate of change in this comparison allows teams to reason about their cost growth (or
     * reduction) and compare it to metrics important to the business.
     *
     * @param group - The group id from getUserGroups or query parameters
     * @param intervals - An ISO 8601 repeating interval string, such as R2/P30D/2020-09-01
     *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
     */
    getGroupDailyCost(group: string, intervals: string): Promise<Cost>;
    /**
     * Get daily cost aggregations for a given billing entity (project in GCP, AWS has a similar
     * concept in billing accounts) and interval time frame.
     *
     * The return type includes an array of daily cost aggregations as well as statistics about the
     * change in cost over the intervals. Calculating these statistics requires us to bucket costs
     * into two or more time periods, hence a repeating interval format rather than just a start and
     * end date.
     *
     * The rate of change in this comparison allows teams to reason about the project's cost growth
     * (or reduction) and compare it to metrics important to the business.
     *
     * @param project - The project id from getGroupProjects or query parameters
     * @param intervals - An ISO 8601 repeating interval string, such as R2/P30D/2020-09-01
     *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
     */
    getProjectDailyCost(project: string, intervals: string): Promise<Cost>;
    /**
     * Get aggregations for a particular metric and interval time frame. Teams
     * can see metrics important to their business in comparison to the growth
     * (or reduction) of a project or group's daily costs.
     *
     * @param metric - A metric from the cost-insights configuration in app-config.yaml.
     * @param intervals - An ISO 8601 repeating interval string, such as R2/P30D/2020-09-01
     *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
     */
    getDailyMetricData(metric: string, intervals: string): Promise<MetricData>;
    /**
     * Get cost aggregations for a particular cloud product and interval time frame. This includes
     * total cost for the product, as well as a breakdown of particular entities that incurred cost
     * in this product. The type of entity depends on the product - it may be deployed services,
     * storage buckets, managed database instances, etc.
     *
     * If project is supplied, this should only return product costs for the given billing entity
     * (project in GCP).
     *
     * The time period is supplied as a Duration rather than intervals, since this is always expected
     * to return data for two bucketed time period (e.g. month vs month, or quarter vs quarter).
     *
     * @param options - Options to use when fetching insights for a particular cloud product and
     *                interval time frame.
     */
    getProductInsights(options: ProductInsightsOptions): Promise<Entity>;
    /**
     * Get current cost alerts for a given group. These show up as Action Items for the group on the
     * Cost Insights page. Alerts may include cost-saving recommendations, such as infrastructure
     * migrations, or cost-related warnings, such as an unexpected billing anomaly.
     */
    getAlerts(group: string): Promise<Alert[]>;
};
declare const costInsightsApiRef: _backstage_core_plugin_api.ApiRef<CostInsightsApi>;

declare class ExampleCostInsightsClient implements CostInsightsApi {
    private request;
    getLastCompleteBillingDate(): Promise<string>;
    getUserGroups(userId: string): Promise<Group[]>;
    getGroupProjects(group: string): Promise<Project[]>;
    getDailyMetricData(metric: string, intervals: string): Promise<MetricData>;
    getGroupDailyCost(group: string, intervals: string): Promise<Cost>;
    getProjectDailyCost(project: string, intervals: string): Promise<Cost>;
    getProductInsights(options: ProductInsightsOptions): Promise<Entity>;
    getAlerts(group: string): Promise<Alert[]>;
}

declare type BarChartProps = {
    resources: ResourceData[];
    responsive?: boolean;
    displayAmount?: number;
    options?: Partial<BarChartData>;
    tooltip?: ContentRenderer<TooltipProps>;
    onClick?: RechartsFunction;
    onMouseMove?: RechartsFunction;
};
declare const BarChart: ({ resources, responsive, displayAmount, options, tooltip, onClick, onMouseMove, }: BarChartProps) => JSX.Element;

declare type BarChartLegendOptions = {
    previousName: string;
    previousFill: string;
    currentName: string;
    currentFill: string;
    hideMarker?: boolean;
};
declare type BarChartLegendProps = {
    costStart: number;
    costEnd: number;
    options?: Partial<BarChartLegendOptions>;
};
declare const BarChartLegend: ({ costStart, costEnd, options, children, }: PropsWithChildren<BarChartLegendProps>) => JSX.Element;

declare type BarChartTooltipProps = {
    title: string;
    content?: ReactNode | string;
    subtitle?: ReactNode;
    topRight?: ReactNode;
    actions?: ReactNode;
};
declare const BarChartTooltip: ({ title, content, subtitle, topRight, actions, children, }: PropsWithChildren<BarChartTooltipProps>) => JSX.Element;

declare type TooltipItem = {
    fill: string;
    label: string;
    value: string;
};
declare type BarChartTooltipItemProps = {
    item: TooltipItem;
};
declare const BarChartTooltipItem: ({ item }: BarChartTooltipItemProps) => JSX.Element;

declare type CostGrowthProps = {
    change: ChangeStatistic;
    duration: Duration;
};
declare const CostGrowth: ({ change, duration }: CostGrowthProps) => JSX.Element;

declare type CostGrowthIndicatorProps = TypographyProps & {
    change: ChangeStatistic;
    formatter?: (change: ChangeStatistic) => Maybe<string>;
};
declare const CostGrowthIndicator: ({ change, formatter, className, ...props }: CostGrowthIndicatorProps) => JSX.Element;

declare type LegendItemProps = {
    title: string;
    tooltipText?: string;
    markerColor?: string;
};
declare const LegendItem: ({ title, tooltipText, markerColor, children, }: PropsWithChildren<LegendItemProps>) => JSX.Element;

declare type ConfigContextProps = {
    metrics: Metric[];
    products: Product[];
    icons: Icon[];
    engineerCost: number;
    currencies: Currency[];
};

declare type CurrencyContextProps = {
    currency: Currency;
    setCurrency: Dispatch<SetStateAction<Currency>>;
};

declare type PartialPropsWithChildren<T> = PropsWithChildren<Partial<T>>;
declare type MockConfigProviderProps = PartialPropsWithChildren<ConfigContextProps>;
declare const MockConfigProvider: ({ children, ...context }: MockConfigProviderProps) => JSX.Element;
declare type MockCurrencyProviderProps = PartialPropsWithChildren<CurrencyContextProps>;
declare const MockCurrencyProvider: ({ children, ...context }: MockCurrencyProviderProps) => JSX.Element;

/**
 * The alert below is an example of an Alert implementation; the CostInsightsApi permits returning
 * any implementation of the Alert type, so adopters can create their own. The CostInsightsApi
 * fetches alert data from the backend, then creates Alert classes with the data.
 */
declare class ProjectGrowthAlert implements Alert {
    data: ProjectGrowthData;
    constructor(data: ProjectGrowthData);
    get url(): string;
    get title(): string;
    get subtitle(): string;
    get element(): JSX.Element;
}

/**
 * The alert below is an example of an Alert implementation; the CostInsightsApi permits returning
 * any implementation of the Alert type, so adopters can create their own. The CostInsightsApi
 * fetches alert data from the backend, then creates Alert classes with the data.
 */
declare class UnlabeledDataflowAlert implements Alert {
    data: UnlabeledDataflowData;
    status?: AlertStatus;
    constructor(data: UnlabeledDataflowData);
    get url(): string;
    get title(): string;
    get subtitle(): string;
    get element(): JSX.Element;
}

export { Alert, AlertCost, AlertDismissFormData, AlertDismissOption, AlertDismissOptions, AlertDismissReason, AlertForm, AlertFormProps, AlertOptions, AlertSnoozeFormData, AlertSnoozeOption, AlertSnoozeOptions, AlertStatus, BarChart, BarChartData, BarChartLegend, BarChartLegendOptions, BarChartLegendProps, BarChartOptions, BarChartProps, BarChartTooltip, BarChartTooltipItem, BarChartTooltipItemProps, BarChartTooltipProps, ChangeStatistic, ChangeThreshold, ChartData, Cost, CostGrowth, CostGrowthIndicator, CostGrowthIndicatorProps, CostGrowthProps, CostInsightsApi, CostInsightsLabelDataflowInstructionsPage, CostInsightsPage, CostInsightsPalette, CostInsightsPaletteOptions, CostInsightsProjectGrowthInstructionsPage, CostInsightsTheme, CostInsightsThemeOptions, Currency, CurrencyType, DEFAULT_DATE_FORMAT, DataKey, DateAggregation, Duration, EngineerThreshold, Entity, ExampleCostInsightsClient, Group, GrowthType, Icon, IconType, LegendItem, LegendItemProps, Loading, Maybe, Metric, MetricData, MockConfigProvider, MockCurrencyProvider, PageFilters, Product, ProductFilters, ProductInsightsOptions, ProductPeriod, Project, ProjectGrowthAlert, ProjectGrowthData, ResourceData, TooltipItem, Trendline, UnlabeledDataflowAlert, UnlabeledDataflowAlertProject, UnlabeledDataflowData, costInsightsApiRef, costInsightsPlugin, costInsightsPlugin as plugin };
