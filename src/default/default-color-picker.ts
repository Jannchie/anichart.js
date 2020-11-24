import { ColorPicker } from "../base/color-picker";

export class DefaultColorPicker implements ColorPicker {
  private colorIndex = 0;
  background: string = "#1E1E1E";
  colorMap: Map<string, string> = new Map<string, string>();
  colorScheme: string[] = [
    "#27C",
    "#FB0",
    "#FFF",
    "#2C8",
    "#D23",
    "#0CE",
    "#E8A",
    "#DDA",
    "#C86",
    "#F72",
    "#C8C",
    "#BCA",
    "#F27",
  ];
  getColor(key: string): string {
    let color = this.colorMap.get(key);
    if (!color) {
      color = this.getNewColor();
      this.colorMap.set(key, color);
    }
    return color;
  }
  getNewColor(): string {
    return this.colorScheme[this.colorIndex++ % this.colorScheme.length];
  }
}
