import { BaseOptions } from "./BaseOptions";
import { FontOptions } from "./FontOptions";

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
  // 标签碰撞检测
  collide?: boolean;

  dateKey?: string;
  valueKey?: string;
  idKey?: string;

  showTime?: [number, number];
  days?: number;
}
