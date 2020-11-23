import { Base } from "./base";
import { Component } from "./component";
export interface Groupable {
    addComponent(c: Component): void;
    components: Component[];
}
export declare class GroupComponent extends Base implements Groupable {
    render(n: number): void;
    components: Base[];
    constructor(options: any);
    addComponent(c: Base): void;
    reset(options?: any): void;
    draw(n: number): void;
}
