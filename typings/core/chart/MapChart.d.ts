import * as d3 from "d3";
import { Component } from "../component/Component";
import { Path } from "../component/Path";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface MapChartOptions extends BaseChartOptions {
    pathShadowBlur: number;
    pathShadowColor: string;
    useShadow: boolean;
    showGraticule: boolean;
    margin?: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    projectionType?: "orthographic" | "natural" | "mercator" | "equirectangular";
    mapIdField: string;
    visualMap?: (t: number) => string;
    getMapId?: (id: string) => string;
    visualRange: "total" | "current" | "history" | [number, number];
    strokeStyle?: string;
    defaultFill?: string;
}
export declare class MapChart extends BaseChart {
    geoGener: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    pathMap: Map<string, string>;
    pathComponentMap: Map<string, Path>;
    projection: d3.GeoProjection;
    map: any;
    mapIdField: string;
    visualMap: (t: number) => string;
    visualRange: "total" | "current" | "history" | [number, number];
    getMapId: (id: string) => string;
    strokeStyle: string;
    defaultFill: string;
    projectionType: "orthographic" | "natural" | "mercator" | "equirectangular";
    scale: d3.ScaleLinear<number, number, never>;
    showGraticule: boolean;
    graticulePath: string;
    graticulePathComp: Path;
    pathShadowBlur: number;
    pathShadowColor: string | undefined;
    useShadow: boolean;
    constructor(options?: MapChartOptions);
    margin: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    setup(stage: Stage): void;
    wrapper: Component;
    private init;
    private initGeoPath;
    private updatePathMap;
    private initComps;
    getComponent(sec: number): Component;
    updateScale(sec: number): void;
    updatePath(sec: number): void;
    updateProject(sec: number): void;
}
export {};
