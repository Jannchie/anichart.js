import * as d3 from "d3";
import { BaseChart, BaseChartOptions, Component, Path, Stage } from "../..";
interface MapChartOptions extends BaseChartOptions {
    margin: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
}
export declare class MapChart extends BaseChart {
    map: any;
    geoGener: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    pathMap: Map<string, string>;
    pathComponentMap: Map<string, Path>;
    constructor(options?: MapChartOptions);
    margin: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    setup(stage: Stage): void;
    wrapper: Component;
    getComponent(sec: number): Component;
}
export {};
