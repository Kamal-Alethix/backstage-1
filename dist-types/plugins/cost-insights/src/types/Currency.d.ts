export interface Currency {
    kind: string | null;
    label: string;
    unit: string;
    prefix?: string;
    rate?: number;
}
export declare enum CurrencyType {
    USD = "USD",
    CarbonOffsetTons = "CARBON_OFFSET_TONS",
    Beers = "BEERS",
    IceCream = "PINTS_OF_ICE_CREAM"
}
