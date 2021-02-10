import * as d3 from "d3";
import { BaseChart, BaseChartOptions, Component, Path, Stage } from "../..";
import { recourse } from "../Recourse";
interface MapChartOptions extends BaseChartOptions {
  margin?: { top: number; left: number; right: number; bottom: number };
  visualMap?: (t: number) => string;
  projectionType?: "orthographic" | "natural" | "mercator" | "equirectangular";
}
export class MapChart extends BaseChart {
  geoGener: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  pathMap: Map<string, string>;
  pathComponentMap: Map<string, Path>;
  projection: d3.GeoProjection;
  map: any;
  visualMap: (t: number) => string;
  projectionType: "orthographic" | "natural" | "mercator" | "equirectangular";
  constructor(options?: MapChartOptions) {
    super(options);
    this.margin = options?.margin ?? {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    };
    this.visualMap = options?.visualMap ?? d3.interpolateInferno;
    this.projectionType = options?.projectionType;
  }
  margin: { top: number; left: number; right: number; bottom: number };
  setup(stage: Stage) {
    super.setup(stage);
    const map = recourse.data.get("map");
    let projection;
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
          this.stage.canvas.width - this.margin.right,
          this.stage.canvas.height - this.margin.bottom,
        ],
      ],
      map
    );

    this.projection = projection;
    this.map = map;
    this.init(projection, map);
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
      const alpha3Code = feature.properties.alpha3Code;
      const path = geoGener(feature);
      this.pathMap.set(alpha3Code, path);
    }
  }
  private initComps() {
    this.wrapper = new Component();
    this.pathComponentMap = new Map<string, Path>();
    this.pathMap.forEach((p, alpha3Code) => {
      const path = new Path({
        path: p,
        fillStyle: "#666",
        strokeStyle: "#FFF",
      });
      this.wrapper.children.push(path);
      this.pathComponentMap.set(alpha3Code, path);
    });
  }

  getComponent(sec: number) {
    this.updateProject(sec);
    this.updatePath(sec);
    return this.wrapper;
  }
  updatePath(sec: number) {
    for (const feature of this.map.features) {
      const alpha3Code = feature.properties.alpha3Code;
      const path = this.geoGener(feature);
      const comp = this.pathComponentMap.get(alpha3Code);
      comp.path = path;
      const d = this.dataScales.get(alpha3Code);
      if (d) {
        const scale = d3.scaleLinear(
          [this.totallyMin, this.totallyMax],
          [0, 1]
        );
        const currentValue = d(sec)[this.valueField];
        const color = this.visualMap(scale(currentValue));
        comp.fillStyle = color;
      }
    }
  }

  updateProject(sec: number) {
    this.projection.rotate([sec * 20, 0]);
  }
}
