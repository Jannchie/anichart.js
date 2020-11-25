import { BaseOptions } from "./base-options";
import { FontOptions } from "./font-options";

export interface LineChartOptions extends BaseOptions {
  padding?: { left: number; right?: number; bottom?: number; top?: number };
  margin?: { left: number; right?: number; bottom?: number; top?: number };
  labelFont?: FontOptions;
  timeFormat?: string;
  valueFormat?: string;
  lineWidth?: number;
  pointR?: number;
  strict?: boolean;
  // 标签定义
  getLabel?: (id: string, value: number) => string;
  dateKey?: string;
  valueKey?: string;
  idKey?: string;

  showTime?: [number, number];
  days?: number;
}
