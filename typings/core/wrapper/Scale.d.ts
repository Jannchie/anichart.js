import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
export declare function getScaleWrapped(child: Ani | Component, scale: ((sec: number) => {
    x: number;
    y: number;
}) | {
    x: number;
    y: number;
} | ((sec: number) => number)): Ani;
