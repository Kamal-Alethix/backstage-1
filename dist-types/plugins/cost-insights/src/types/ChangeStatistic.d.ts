export interface ChangeStatistic {
    ratio?: number;
    amount: number;
}
export declare const EngineerThreshold = 0.5;
export declare enum ChangeThreshold {
    upper = 0.05,
    lower = -0.05
}
export declare enum GrowthType {
    Negligible = 0,
    Savings = 1,
    Excess = 2
}
