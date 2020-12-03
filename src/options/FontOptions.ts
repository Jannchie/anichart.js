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
export interface FontOptions {
  font?: string;
  fontSize?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  fontVariant?: FontVariant;
}

export class DefaultFontOptions implements FontOptions {
  font = "Sarasa Mono SC";
  fontSize = 16;
  textAlign = "left" as CanvasTextAlign;
  textBaseline = "alphabetic" as CanvasTextBaseline;
  fontWeight = "normal" as FontWeight;
  fontVariant = "normal" as FontVariant;
  fontStyle = "normal" as FontStyle;
}

export interface Fontable {
  font: FontOptions;
}
