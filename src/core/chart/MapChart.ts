import * as d3 from "d3";
import { Component, ShadowOptions } from "../component/Component";
import { Path } from "../component/Path";
import { recourse } from "../Recourse";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface MapChartOptions extends BaseChartOptions {
  pathShadowBlur?: number;
  pathShadowColor?: string;
  useShadow?: boolean;
  showGraticule?: boolean;
  margin?: { top: number; left: number; right: number; bottom: number };
  projectionType?: "orthographic" | "natural" | "mercator" | "equirectangular";
  mapIdField?: string;
  visualMap?: (t: number) => string;
  getMapId?: (id: string) => string;
  visualRange?: "total" | "current" | "history" | [number, number];
  strokeStyle?: string;
  defaultFill?: string;
}
export class MapChart extends BaseChart {
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

  constructor(options?: MapChartOptions) {
    super(options);
    if (!options) return;
    this.margin = options?.margin ?? {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    };
    this.visualMap = options.visualMap ?? d3.interpolateInferno;
    this.getMapId = options.getMapId ?? ((id) => id);
    this.mapIdField = options.mapIdField ?? "alpha3Code";
    this.strokeStyle = options.strokeStyle ?? "#FFF";
    this.defaultFill = options.defaultFill ?? "#FFF1";
    this.projectionType = options.projectionType ?? "natural";
    this.visualRange = options.visualRange ?? "current";
    this.useShadow = options.useShadow ?? false;
    this.pathShadowColor = options.pathShadowColor;
    this.pathShadowBlur = options.pathShadowBlur ?? 100;
    this.showGraticule = options.showGraticule ?? false;
  }
  margin: { top: number; left: number; right: number; bottom: number };
  setup(stage: Stage) {
    super.setup(stage);
    if (stage) {
      const map = recourse.data.get("map");
      let projection: d3.GeoProjection;
      switch (this.projectionType) {
        case "orthographic":
          projection = d3.geoOrthographic();
          break;
        case "natural":
          projection = d3.geoNaturalEarth1();
          break;
        case "mercator":
          projection = d3.geoMercator();
          break;
        case "equirectangular":
          projection = d3.geoEquirectangular();
        default:
          projection = d3.geoNaturalEarth1();
      }
      projection.fitExtent(
        [
          [this.margin.left, this.margin.top],
          [
            stage.canvas.width - this.margin.right,
            stage.canvas.height - this.margin.bottom,
          ],
        ],
        map
      );

      this.projection = projection;
      this.map = map;
      this.init(projection, map);
    }
  }
  wrapper: Component;
  private init(projection: d3.GeoProjection, map: any) {
    this.initGeoPath(projection, map);
    this.initComps();
  }

  private initGeoPath(projection: d3.GeoProjection, map: any) {
    const geoGener = d3.geoPath(projection);
    this.geoGener = geoGener;
    this.pathMap = new Map<string, string>();
    this.updatePathMap(map, geoGener);
  }

  private updatePathMap(
    map: any,
    geoGener: d3.GeoPath<any, d3.GeoPermissibleObjects>
  ) {
    for (const feature of map.features) {
      const mapId = feature.properties[this.mapIdField];
      const path = geoGener(feature);
      if (path) this.pathMap.set(mapId, path);
    }
  }
  private initComps() {
    this.wrapper = new Component();
    this.pathComponentMap = new Map<string, Path>();

    this.pathMap.forEach((p, mapId) => {
      const path = new Path({
        path: p,
        fillStyle: this.defaultFill,
        strokeStyle: this.strokeStyle,
      });
      this.wrapper?.children?.push(path);
      this.pathComponentMap.set(mapId, path);
    });
    if (this.showGraticule) {
      const stroke = d3.color(this.strokeStyle);
      if (stroke) {
        stroke.opacity = 0.25;
      }
      this.graticulePathComp = new Path({
        path: this.graticulePath,
        strokeStyle: stroke?.toString(),
        fillStyle: "#0000",
      });
      this.wrapper?.children?.push(this.graticulePathComp);
    }
  }

  getComponent(sec: number) {
    this.updateScale(sec);
    this.updateProject(sec);
    this.updatePath(sec);
    return this.wrapper;
  }
  updateScale(sec: number) {
    [this.currentMin, this.currentMax] = d3.extent(
      this.getCurrentData(sec),
      (d) => d[this.valueField]
    );
    if (this.currentMax > this.historyMax) {
      this.historyMax = this.currentMax;
    }
    if (this.historyMin > this.currentMin) {
      this.historyMin = this.currentMax;
    }
    if (typeof this.visualRange === "string") {
      switch (this.visualRange) {
        case "total":
          this.scale = d3
            .scaleLinear([this.totallyMin, this.totallyMax], [0, 1])
            .clamp(true);
          break;
        case "history":
          this.scale = d3
            .scaleLinear([this.historyMin, this.historyMax], [0, 1])
            .clamp(true);
        default:
          this.scale = d3
            .scaleLinear([this.currentMin, this.currentMax], [0, 1])
            .clamp(true);
          break;
      }
    } else {
      this.scale = d3.scaleLinear(this.visualRange, [0, 1]).clamp(true);
    }
  }
  updatePath(sec: number) {
    if (this.showGraticule) {
      const graticulePath = this.geoGener(d3.geoGraticule10());
      if (graticulePath) {
        this.graticulePathComp.path = graticulePath;
      }
    }
    for (const feature of this.map.features) {
      const mapId = feature.properties[this.mapIdField];
      const path = this.geoGener(feature);
      const comp = this.pathComponentMap.get(mapId);
      if (comp && path) comp.path = path;
    }
    for (const [id, data] of this.dataScales) {
      const mapId = this.getMapId(id);
      const currentValue = data(sec)[this.valueField];
      const rate = this.scale(currentValue);
      const color = this.visualMap(rate);
      const comp = this.pathComponentMap.get(mapId);
      if (comp) {
        comp.fillStyle = color;
        if (this.useShadow) {
          comp.shadow = {
            enable: true,
            blur: this.pathShadowBlur * rate + 1,
            color: this.pathShadowColor ?? color,
          } as ShadowOptions;
        }
      }
    }
  }

  updateProject(sec: number) {
    this.projection.rotate([sec * 20, 0]);
  }
}
