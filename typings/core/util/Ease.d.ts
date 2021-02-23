import { easeCubicOut } from "d3";
export declare function customInOut(time: [number, number, number, number], range?: [number, number], interruption?: (typeof easeCubicOut)[]): (normalizedTime: number) => number;
export * as ease from "d3-ease";
