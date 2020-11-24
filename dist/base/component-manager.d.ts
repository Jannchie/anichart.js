import { Component } from "../components";
export interface ComponentManager {
    components: Component[];
    addComponent(c: Component): void;
}
