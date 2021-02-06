import * as d3 from "d3";
import { BaseChart, BaseChartOptions, Component, Path, Stage } from "../..";
import { recourse } from "../Recourse";
interface MapChartOptions extends BaseChartOptions {
  margin: { top: number; left: number; right: number; bottom: number };
}
export class MapChart extends BaseChart {
  map: any;
  geoGener: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  pathMap: Map<string, string>;
  pathComponentMap: Map<string, Path>;
  constructor(options?: MapChartOptions) {
    super(options);
    this.margin = options?.margin ?? {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
    };
  }
  margin: { top: number; left: number; right: number; bottom: number };
  setup(stage: Stage) {
    super.setup(stage);
    const map = recourse.data.get("map");
    const projection = d3.geoMercator().fitExtent(
      [
        [this.margin.left, this.margin.top],
        [
          this.stage.canvas.width - this.margin.right,
          this.stage.canvas.height - this.margin.bottom,
        ],
      ],
      map
    );
    const geoGener = d3.geoPath(projection);
    this.geoGener = geoGener;
    this.pathMap = new Map<string, string>();
    for (const feature of map.features) {
      const name = feature.properties.name;
      const path = geoGener(feature);
      this.pathMap.set(name, path);
    }
    this.wrapper = new Component();
    this.pathComponentMap = new Map<string, Path>();
    this.pathMap.forEach((v, k) => {
      const path = new Path({
        path: v,
        fillStyle: "#666",
        strokeStyle: "#FFF",
      });
      this.wrapper.children.push(path);
      this.pathComponentMap.set(k, path);
    });
  }
  wrapper: Component;
  getComponent(sec: number) {
    const data = this.getCurrentData(sec);
    const component = this.wrapper;
    return component;
  }
}
