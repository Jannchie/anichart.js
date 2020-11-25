import * as d3 from "d3";
import { DSVRowArray } from "d3";
import { ChartCompoment } from "../components/chart-compoment";
import { LineChartOptions } from "../options/line-chart-options";
import { DefaultFontOptions } from "../options/font-options";
export declare class LineChart extends ChartCompoment {
  shape: {
    width: number;
    height: number;
  };
  scales: {
    x: d3.ScaleLinear<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
  };
  dataGroup: Map<any, any[]>;
  lineGen: d3.Line<[number, number]>;
  areaGen: d3.Area<[number, number]>;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  data: DSVRowArray<string>;
  tsRange: [number, number];
  dtRange: [number, number];
  showTime: [number, number];
  lineWidth: number;
  pointR: number;
  labelFont: DefaultFontOptions;
  timeFormat: string;
  valueFormat: string;
  days: number;
  tickFadeThreshold: number;
  private xMax;
  private tickAlpha;
  strict: boolean;
  getLabel(k: string, y: number): string;
  constructor(options?: LineChartOptions);
  update(options?: LineChartOptions): void;
  private setLine;
  private setDataGroup;
  private setScale;
  private get yBottom();
  private get yTop();
  private get xRight();
  private get xLeft();
  private setRange;
  preRender(): void;
  render(): void;
  private findY;
}
