export interface ShadowOptions {
  enable?: boolean;
  color?: string;
  blur?: number;
  offset?: { x: number; y: number };
  fillColor?: string | CanvasGradient | CanvasPattern;
  strokeColor?: string | CanvasGradient | CanvasPattern;
}

export class Component {
  shadow = { enable: false } as ShadowOptions;
  position: { x: number; y: number } = { x: 0, y: 0 };
  offset: { x: number; y: number } = { x: 0, y: 0 };
  children: Component[] = [];
  alpha: number = 1;
  filter: string;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern = "#0000";
}
