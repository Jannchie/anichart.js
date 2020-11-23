import { Base } from "./base";
import { Component } from "./component";
export interface groupable {
    addComponent(c: Component): void;
    components: Component[];
}
export declare class Group extends Base implements groupable {
    render(n: number): void;
    components: Base[];
    constructor(options: any);
    addComponent(c: Base): void;
    reset(options: any): void;
    draw(n: number): void;
}
