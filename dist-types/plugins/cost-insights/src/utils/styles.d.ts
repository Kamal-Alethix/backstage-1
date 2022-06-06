import { CostInsightsTheme, CostInsightsThemeOptions } from '../types';
export declare const costInsightsLightTheme: CostInsightsThemeOptions;
export declare const costInsightsDarkTheme: CostInsightsThemeOptions;
export declare function brighten(color: string, coefficient?: number): string;
export declare const useCostOverviewStyles: (theme: CostInsightsTheme) => {
    axis: {
        fill: string;
    };
    container: {
        height: number;
        width: number;
    };
    cartesianGrid: {
        stroke: string;
    };
    chart: {
        margin: {
            right: number;
            top: number;
        };
    };
    yAxis: {
        width: number;
    };
};
export declare const useOverviewTabsStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useBarChartStyles: (theme: CostInsightsTheme) => {
    axis: {
        fill: string;
    };
    barChart: {
        margin: {
            left: number;
            right: number;
        };
    };
    cartesianGrid: {
        stroke: string;
    };
    cursor: {
        fill: string;
        fillOpacity: number;
    };
    container: {
        height: number;
        width: number;
    };
    infoIcon: {
        marginLeft: number;
        fontSize: string;
    };
    xAxis: {
        height: number;
    };
};
export declare const useBarChartLayoutStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useBarChartStepperButtonStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useBarChartLabelStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useCostInsightsStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useCostInsightsTabsStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useAlertCardActionHeaderStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useCostGrowthStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useCostGrowthLegendStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useBarChartStepperStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useNavigationStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useTooltipStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useAlertInsightsSectionStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useSelectStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useActionItemCardStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useProductInsightsCardStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useProductInsightsChartStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useBackdropStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useSubtleTypographyStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useEntityDialogStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<string>;
export declare const useAlertDialogStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<"icon" | "radio" | "content" | "actions">;
export declare const useAlertStatusSummaryButtonStyles: (props?: any) => import("@material-ui/styles").ClassNameMap<"icon" | "clicked">;
