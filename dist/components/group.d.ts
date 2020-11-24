import { Base } from "./base";
import { Component } from "./component";
export interface Groupable {
    addComponent(c: Component): void;
    components: Component[];
}
export declare class GroupComponent extends Base implements Groupable {
    render(): void;
    components: Component[];
    constructor(options: any);
    addComponent(c: Base): void;
    update(options?: any): void;
    draw(): void;
}
