import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
export declare class Group implements Component {
    ani: Ani;
    pos: Position;
    components: Component[];
    draw(n: number): void;
}
