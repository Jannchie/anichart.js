import { BaseComponent } from "./base-component";
import { Component } from "./component";
export interface Groupable {
    addComponent(c: Component): void;
    components: Component[];
}
export declare class GroupComponent extends BaseComponent implements Groupable {
    render(): void;
    components: Component[];
    constructor(options: any);
    addComponent(c: BaseComponent): void;
    update(options?: any): void;
    draw(): void;
}
