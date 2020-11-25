import { Component } from "../components";
import { ComponentManager } from "../interface";
export declare class DefaultComponentManager implements ComponentManager {
    components: Component[];
    addComponent(c: Component): void;
}
