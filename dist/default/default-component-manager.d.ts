import { Component } from "../components";
import { ComponentManager } from "../base/component-manager";
export declare class DefaultComponentManager implements ComponentManager {
    components: Component[];
    addComponent(c: Component): void;
}
