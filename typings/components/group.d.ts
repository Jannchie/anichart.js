import { BaseOptions } from "../options/base-options";
import { BaseComponent } from "./BaseComponent";
import { Component } from "./component";
export interface Groupable {
    addComponent(c: Component): void;
    components: Component[];
    updateChild(): void;
}
export declare class GroupComponent extends BaseComponent implements Groupable {
    render(): void;
    components: Component[];
    constructor(options?: BaseOptions);
    addComponent(c: BaseComponent): void;
    update(): void;
    updateChild(): void;
    draw(): void;
}
