import { Component } from "../component/Component";
import { Text } from "../component/Text";
import { Ani } from "./Ani";

export class TextLinesAni extends Ani {
  component: Text = new Text();
  lineSpacing = 0;
  getComponent(sec: number) {
    this.component.text = "";
    this.component.children = [];
    let basePosY = 0;
    this.children.forEach((textAni) => {
      let comp: Component;

      if (textAni instanceof Ani) {
        comp = textAni.getComponent(sec);
      } else {
        comp = textAni;
      }
      if (!comp.position) {
        if (comp.type === "component" && this.stage && this.stage.canvas) {
          comp.position = {
            x: this.stage.canvas.width / 2,
            y: this.stage.canvas.height / 2,
          };
        } else {
          comp.position = {
            x: 0,
            y: 0,
          };
        }
      }
      comp.position.y = basePosY;
      if (comp instanceof Text) {
        const fontSize = comp.fontSize
          ? comp.fontSize
          : this.component.fontSize;
        basePosY += comp.position.y + this.lineSpacing + fontSize;
      }
      this.component.children.push(comp);
    });
    return this.component;
  }
}
