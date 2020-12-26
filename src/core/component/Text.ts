import { Component } from "./Component";
export type FontWeight =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;
export type FontVariant = "normal" | "small-caps";
export type FontStyle = "normal" | "italic" | "oblique";
export class Text extends Component {
  text?: string = "";
  textAlign?: CanvasTextAlign = "left";
  textBaseline?: CanvasTextBaseline = "top";
  fontVariant?: FontVariant = "normal";
  fontWeight?: FontWeight = "normal";
  fontStyle?: FontStyle = "normal";
  fontSize?: number = 16;
  font?: string = "";
  get fontStr() {
    return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${this.fontSize}px ${this.font}`;
  }
}
