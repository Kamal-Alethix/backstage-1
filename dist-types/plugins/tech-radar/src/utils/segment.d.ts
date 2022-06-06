export default class Segment {
    constructor(quadrant: any, ring: any, radius: any, nextSeed: any);
    nextSeed: any;
    polarMin: {
        t: any;
        r: any;
    };
    polarMax: {
        t: any;
        r: any;
    };
    cartesianMin: {
        x: number;
        y: number;
    };
    cartesianMax: {
        x: number;
        y: number;
    };
    clipx(d: any): any;
    clipy(d: any): any;
    random(): {
        x: number;
        y: number;
    };
    _random(): number;
    _randomBetween(min: any, max: any): any;
    _normalBetween(min: any, max: any): any;
}
