import { TextOptions } from "./text-options";

export interface FadeTextOptions extends TextOptions {
  // 展示时间
  time?: number;
  // 持续时间
  last?: number;
  // 淡入、淡出时间
  fade?: number;
}
