import Pos from "../utils/position";

export interface ShadowOptions {
  enable?: boolean;
  color?: string;
  blur?: number;
  offset?: Pos;
}

export class DefaultShadowOptions implements ShadowOptions {
  enable = false;
  color = "#1e1e1e";
  blur = 4;
  offset = { x: 0, y: 0 } as Pos;
}

export interface Shadowable {
  shadow: ShadowOptions;
}
