import { csv } from "d3";
import { csvParse, DSVRowArray } from "d3-dsv";
import { ChartOptions } from "../options/ChartOptions";
import { Chart } from "./chart-interface";
import { GroupComponent as Group } from "./Group";

export abstract class ChartComponent extends Group implements Chart {
  dateKey = "date";
  valueKey = "value";
  idKey = "id";
  colorKey = "id";
  colorMap = new Map<string, string>();
  setOptions(options: ChartOptions) {
    if (options.color) {
      for (const key of Object.keys(options.color)) {
        this.colorMap.set(key, options.color[key]);
      }
    }
  }

  async loadData(path: string | any): Promise<void> {
    this.hinter.drawHint("Loading Data...");
    this.data = await this.readCsv(path);
    this.hinter.drawHint("Loading Data...Finished!");
    if (this.components) {
      this.hinter.drawHint(`Refresh Components...`);
      this.update();
      this.components.forEach((c) => {
        c.update();
      });
      this.hinter.drawHint("Refresh Components... Finished!");
    }
  }
  update() {
    if (this.colorPicker) {
      this.colorPicker.colorMap = this.colorMap;
    }
    super.update();
    if (this.components) {
      this.components.forEach((c) => {
        c.update();
      });
    }
  }
  private async readCsv(path: string | any): Promise<DSVRowArray<string>> {
    if (typeof path !== "string") {
      path = path.default;
    }
    if (typeof window === "undefined") {
      const fs = require("fs");
      return csvParse(fs.readFileSync(path).toString());
    } else {
      if ("object" === typeof path) {
        return csv(path);
      }
      return csv(path);
    }
  }
  async loadMeta(path: string | any): Promise<void> {
    this.player.renderer.hinter.drawHint("Loading Meta...");
    this.meta = await this.readCsv(path);
    this.player.renderer.hinter.drawHint("Loading Data...Finished!");
    if (this.components) {
      this.player.renderer.hinter.drawHint(`Refresh Components...`);
      this.components.forEach((c) => {
        c.update();
      });
      this.player.renderer.hinter.drawHint("Refresh Components... Finished!");
    }
  }
  data: DSVRowArray<string>;
  meta: DSVRowArray<string>;
}
