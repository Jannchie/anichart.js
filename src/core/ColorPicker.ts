class ColorPicker {
  private colorIndex = 0;
  private colorMap: Map<string, string> = new Map<string, string>();
  colorScheme: string[] = [
    "#D33",
    "#27C",
    "#FB0",
    "#2C8",
    "#FFF",
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
  setColor(key: string, color: string) {
    this.colorMap.set(key, color);
  }
}
export const colorPicker = new ColorPicker();
