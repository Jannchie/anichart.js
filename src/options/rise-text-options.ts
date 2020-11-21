import Position from "../utils/position";
import { FadeTextOptions } from "./fade-text-options";

export interface RiseTextOptions extends FadeTextOptions {
  // 偏移
  offset?: number;
  // 反向
  reverse?: boolean;
}
