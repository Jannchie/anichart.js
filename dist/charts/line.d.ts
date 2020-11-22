import { Base } from "../components";
import { LineChartOptions } from "../options/line-chart-options";
export declare class LineChart extends Base {
    shape: {
        width: number;
        height: number;
    };
    reset(options: LineChartOptions): void;
    render(n: number): void;
}
