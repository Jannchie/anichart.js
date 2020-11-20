import Ani from "../charts/ani";
import Position from "../utils/position";

interface Component {
  // 图表对象
  ani?: Ani;
  pos?: Position;
  draw(n: number, pos?: Position): void;
}
export { Component };
