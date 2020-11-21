import Ani from "../charts/ani";
import Position from "../utils/position";
interface Component {
    ani: Ani;
    pos: Position;
    draw(n: number): void;
}
export { Component };
