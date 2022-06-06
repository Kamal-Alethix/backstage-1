import { BackstagePalette, BackstageTheme } from '@backstage/theme';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
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
export declare type CostInsightsPalette = BackstagePalette & CostInsightsPaletteAdditions;
export declare type CostInsightsPaletteOptions = PaletteOptions & CostInsightsPaletteAdditions;
export interface CostInsightsThemeOptions extends PaletteOptions {
    palette: CostInsightsPaletteOptions;
}
export interface CostInsightsTheme extends BackstageTheme {
    palette: CostInsightsPalette;
}
export {};
