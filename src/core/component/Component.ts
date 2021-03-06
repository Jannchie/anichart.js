import { Ani } from "../ani/Ani";
import { Stage } from "../Stage";

export interface ShadowOptions {
  enable?: boolean;
  color?: string;
  blur?: number;
  offset?: { x: number; y: number };
  fillColor?: string | CanvasGradient | CanvasPattern;
  strokeColor?: string | CanvasGradient | CanvasPattern;
}
export interface BaseCompOptions {
  shadow?: ShadowOptions;
  offsetSec?: number;
  center?: { x: number; y: number };
  position?: { x: number; y: number };
  offset?: { x: number; y: number };
  scale?: { x: number; y: number };
  children?: Component[];
  alpha?: number;
  filter?: string;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  lineWidth?: number;
}

export class Component {
  type = "Component";
  offsetSec: number = 0;
  shadow = { enable: false } as ShadowOptions;
  center: { x: number; y: number } = { x: 0, y: 0 };
  position: { x: number; y: number };
  offset: { x: number; y: number } = { x: 0, y: 0 };
  scale: { x: number; y: number };
  children: (Component | Ani)[] = [];
  alpha: number;
  filter: string;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  stage: Stage;
  parent: Component | Ani;
  setup(stage: Stage): void {
    this.children.forEach((child: Component) => {
      child.setup(stage);
    });
  }
  addChild(comp: Component | Ani) {
    this.children.push(comp);
    comp.parent = this;
  }
  constructor(options?: BaseCompOptions) {
    if (options) {
      if (options.offsetSec) this.offsetSec = options.offsetSec;
      if (options.center) this.center = options.center;
      if (options.shadow) this.shadow = options.shadow;
      if (options.position) this.position = options.position;
      if (options.alpha !== undefined) this.alpha = options.alpha;
      if (options.offset) this.offset = options.offset;
      if (options.children) this.children = options.children;
      if (options.scale) this.scale = options.scale;
      if (options.filter) this.filter = options.filter;
      if (options.fillStyle) this.fillStyle = options.fillStyle;
      if (options.strokeStyle) this.strokeStyle = options.strokeStyle;
      if (options.lineWidth) this.lineWidth = options.lineWidth;
    }
  }
}
