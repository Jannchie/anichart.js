import { Base } from ".";
import { Component } from "./component";
export declare class Group extends Base {
    components: Component[];
    addComponent(c: Component): void;
    preRender(n: number): void;
    render(n: number): void;
}
