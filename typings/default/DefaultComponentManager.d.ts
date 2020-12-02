import { Scene } from "../base";
import { Component } from "../components";
import { ComponentManager } from "../interface";
export declare class DefaultComponentManager implements ComponentManager {
    constructor(s: Scene);
    components: Component[];
    addComponent(c: Component): void;
}
