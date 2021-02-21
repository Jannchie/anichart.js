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
  shadow = { enable: false } as ShadowOptions;
  center: { x: number; y: number } = { x: 0, y: 0 };
  position: { x: number; y: number };
  offset: { x: number; y: number } = { x: 0, y: 0 };
  scale: { x: number; y: number };
  children: (Component | null)[] = [];
  alpha: number;
  filter: string;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  setup() {
    this.children.forEach((child: Component) => {
      child.setup();
    });
  }
  addChild(comp: Component | null) {
    this.children.push(comp);
  }
  constructor(options?: BaseCompOptions) {
    if (options) {
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
