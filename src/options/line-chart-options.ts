import { BaseOptions } from "./base-options";
import { FontOptions } from "./font-options";

/**
 * 通过给定id和value，获得label
 */
type GetLabel = (key: string, value: number) => string;

export interface LineChartOptions extends BaseOptions {
  padding?: { left: number; right?: number; bottom?: number; top?: number };
  margin?: { left: number; right?: number; bottom?: number; top?: number };
  labelFont?: FontOptions;
  timeFormat?: string;
  valueFormat?: string;
  lineWidth?: number;
  pointR?: number;
  getLabel?: GetLabel;

  dateKey?: string;
  valueKey?: string;
  idKey?: string;

  showTime?: [number, number];
  days?: number;
}
