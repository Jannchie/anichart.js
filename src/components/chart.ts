import { csv } from "d3";
import { csvParse, DSVRowArray } from "d3-dsv";
import { Base } from "./base";
import { GroupComponent } from "./group";
import * as fs from "fs";
interface LoadCsvFunc {
  (path: string | any): Promise<void>;
}
export interface ChartInterface {
  data: DSVRowArray<string>;
  meta: DSVRowArray<string>;
  loadData: LoadCsvFunc;
  loadMeta: LoadCsvFunc;
}
export abstract class ChartCompoment
  extends GroupComponent
  implements ChartInterface {
  async loadData(path: string | any): Promise<void> {
    this.ani.hinter.drawHint("Loading Data...");
    this.data = await this.readCsv(path);
    this.ani.hinter.drawHint("Loading Data...Finished!");
    if (this.components) {
      this.ani.hinter.drawHint(`Refresh Components...`);
      this.reset();
      this.components.forEach((c) => {
        c.reset();
      });
      this.ani.hinter.drawHint("Refresh Components... Finished!");
    }
  }

  private async readCsv(path: string | any): Promise<DSVRowArray<string>> {
    if (typeof path !== "string") {
      path = path.default;
    }
    if (typeof window === "undefined") {
      return csvParse(fs.readFileSync(path).toString());
    } else {
      if ("object" == typeof path) {
        return csv(path);
      }
      return csv(path);
    }
  }
  async loadMeta(path: string | any): Promise<void> {
    this.ani.hinter.drawHint("Loading Meta...");
    this.meta = await this.readCsv(path);
    this.ani.hinter.drawHint("Loading Data...Finished!");
    if (this.components) {
      this.ani.hinter.drawHint(`Refresh Components...`);
      this.components.forEach((c) => {
        c.reset();
      });
      this.ani.hinter.drawHint("Refresh Components... Finished!");
    }
  }
  data: DSVRowArray<string>;
  meta: DSVRowArray<string>;
}
