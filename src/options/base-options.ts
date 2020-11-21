import Position from "../utils/position";
export interface BaseOptions {
  // 位置
  pos?: Position | Function;
  // 透明度
  alpha?: number | Function;
}
