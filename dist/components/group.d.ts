import { Base } from ".";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
export declare class Group extends Base {
    alpha: number | Function;
    ani: Ani;
    pos: Position | Function;
    components: Component[];
    preRender(n: number): void;
    render(n: number): void;
}
