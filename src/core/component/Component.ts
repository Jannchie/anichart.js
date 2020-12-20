export interface ShadowOptions {
  enable?: boolean;
  color?: string;
  blur?: number;
  offset?: { x: number; y: number };
}

export class Component {
  shadow = { enable: false } as ShadowOptions;
  position: { x: number; y: number } = { x: 0, y: 0 };
  children: Component[] = [];
  alpha: number = 1;
  filter: string;
}
