import { Ani } from "../../ani/Ani";
import { Component } from "../../component/Component";
import { Rect } from "../../component/Rect";
import { Text } from "../../component/Text";

interface BarOptions {
  name: string;
  value: number;
  pos: { x: number; y: number };
  shape: { width: number; height: number };
  color: string;
  radius: number;
}

export class BarChart extends Ani {
  getComponent(sec: number) {
    return this.getBarComponent({
      name: "alpha",
      value: sec,
      pos: { x: 200, y: 200 },
      shape: { width: sec * 100, height: 30 },
      color: "#fff",
      radius: 4,
    });
  }
  getBarComponent(options: BarOptions) {
    const labelPadding = 8;
    const res = new Component({
      position: options.pos,
    });
    const bar = new Rect({
      shape: options.shape,
      fillStyle: options.color,
      radius: options.radius,
      clip: true,
    });
    const label = new Text({
      text: `${options.name}`,
      textAlign: "right",
      textBaseline: "bottom",
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      position: { x: 0 - labelPadding, y: options.shape.height },
      fillStyle: options.color,
    });
    const valueComp = new Text({
      textBaseline: "bottom",
      text: `${options.value}`,
      position: {
        x: options.shape.width + labelPadding,
        y: options.shape.height,
      },
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      fillStyle: options.color,
    });
    const barInfo = new Text({
      textAlign: "right",
      textBaseline: "bottom",
      text: `${options.name}`,
      position: {
        x: options.shape.width - labelPadding,
        y: options.shape.height,
      },
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      fontWeight: "bolder",
      fillStyle: "#888",
    });
    bar.children.push(barInfo);
    res.children.push(bar);
    res.children.push(valueComp);
    res.children.push(label);
    return res as Component;
  }
}
