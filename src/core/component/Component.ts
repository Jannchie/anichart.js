export interface ShadowOptions {
  enable?: boolean;
  color?: string;
  blur?: number;
  offset?: { x: number; y: number };
  fillColor?: string | CanvasGradient | CanvasPattern;
  strokeColor?: string | CanvasGradient | CanvasPattern;
}

export class Component {
  type? = "Component";
  shadow? = { enable: false } as ShadowOptions;
  center?: { x: number; y: number } = { x: 0, y: 0 };
  position?: { x: number; y: number } = { x: 0, y: 0 };
  offset?: { x: number; y: number } = { x: 0, y: 0 };
  scale?: { x: number; y: number };
  children?: Component[] = [];
  alpha?: number;
  filter?: string;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  lineWidth?: number;
  setup? = function () {
    this.children.forEach((child: Component) => {
      child.setup();
    });
  };
  constructor(component?: Component) {
    if (component) {
      if (component.center) this.center = component.center;
      if (component.shadow) this.shadow = component.shadow;
      if (component.position) this.position = component.position;
      if (component.alpha !== undefined) this.alpha = component.alpha;
      if (component.offset) this.offset = component.offset;
      if (component.children) this.children = component.children;
      if (component.scale) this.scale = component.scale;
      if (component.filter) this.filter = component.filter;
      if (component.fillStyle) this.fillStyle = component.fillStyle;
      if (component.strokeStyle) this.strokeStyle = component.strokeStyle;
      if (component.lineWidth) this.lineWidth = component.lineWidth;
    }
  }
}
