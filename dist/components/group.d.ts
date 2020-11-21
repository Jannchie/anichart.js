import { Base } from "./base";
export declare class Group extends Base {
    render(n: number): void;
    components: Base[];
    constructor(options: any);
    addComponent(c: Base): void;
    reset(options: any): void;
    draw(n: number): void;
}
