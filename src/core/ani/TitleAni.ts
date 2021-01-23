import { Component } from "../component/Component";
import { Ani } from "./Ani";

export class TiTleAniAlpha extends Ani {
  getComponent(sec: number) {
    const result = new Component();
    return result;
  }
}
