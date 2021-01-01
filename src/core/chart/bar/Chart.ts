import { Ani } from "../../ani/Ani";
import { Component } from "../../component/Component";
import { Image } from "../../component/Image";
import { Rect } from "../../component/Rect";
import { Text } from "../../component/Text";
import { recourse } from "../../Recourse";
import * as d3 from "d3";

interface BarOptions {
  name: string;
  value: number;
  pos: { x: number; y: number };
  shape: { width: number; height: number };
  color: string;
  radius: number;
  image?: string;
}

export class BarChart extends Ani {
  getComponent(sec: number) {
    const res = new Component();
    res.children.push(
      this.getBarComponent({
        name: "jannchie",
        value: sec,
        pos: { x: 200, y: 200 },
        shape: { width: sec * 100, height: 30 },
        color: "#fff",
        image: "jannchie",
        radius: 4,
      })
    );
    return res;
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
      text: `${d3.format(",.2f")(options.value)}`,
      position: {
        x: options.shape.width + labelPadding,
        y: options.shape.height,
      },
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      fillStyle: options.color,
    });
    const imagePlaceholder = options.image ? options.shape.height : 0;
    const barInfo = new Text({
      textAlign: "right",
      textBaseline: "bottom",
      text: `${options.name}`,
      position: {
        x: options.shape.width - labelPadding - imagePlaceholder,
        y: options.shape.height,
      },
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      fontWeight: "bolder",
      fillStyle: "#1e1e1e",
    });
    if (options.image) {
      const img = new Image({
        path: options.image,
        position: {
          x: options.shape.width - options.shape.height,
          y: 0,
        },
        shape: {
          width: options.shape.height,
          height: options.shape.height,
        },
      });
      bar.children.push(img);
    }
    bar.children.push(barInfo);
    res.children.push(bar);
    res.children.push(valueComp);
    res.children.push(label);
    return res as Component;
  }
}
