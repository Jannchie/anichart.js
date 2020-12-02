import colorThief from "colorthief";
import ColorThiefUmd from "colorthief/dist/color-thief.umd.js";
import { extent, group, max, mean, range } from "d3-array";
import * as d3 from "d3";
import { csvParse } from "d3-dsv";
import { easePolyInOut, easePolyOut } from "d3-ease";
import { csv } from "d3-fetch";
import { format } from "d3-format";
import { interpolateNumber } from "d3-interpolate";
import { scaleLinear } from "d3-scale";
import { timeFormat } from "d3-time-format";
import * as _ from "lodash-es";
import { BaseAniChart } from "../anichart";
let fs;
if (typeof window === "undefined") {
  fs = require("fs");
}
export class BarChart extends BaseAniChart {
  constructor(options = {}) {
    super();
    this.imagePath = "image/";
    this.language = "zh-CN";
    this.width = 1366;
    this.height = 768;
    this.frameRate = 30;
    this.outerMargin = { left: 10, right: 10, top: 10, bottom: 10 };
    this.freeze = 0;
    if (typeof window == "undefined") {
      this.colorThief = colorThief;
    } else {
      this.colorThief = new ColorThiefUmd();
    }
    this.interval = 1;
    this.barRedius = 4;
    this.itemCount = 22;
    this.labelPandding = 10;
    this.axisTextSize = 20;
    this.tickNumber = 6;
    this.dateLabelSize = 48;
    this.slogenSize = 24;
    this.output = false;
    this.outputName = "out";
    this.idField = "id";
    this.keyFrameDeltaTime = undefined;

    this.colorData = [];

    this.barInfo = (data, meta, self) => {
      if (data.name != undefined) {
        if (data.type != undefined) {
          return `${data.type} - ${data.name}`;
        } else {
          return `${data.name}`;
        }
      } else {
        return data[this.idField];
      }
    };
    this.xDomain = (series) => [0, series.max];
    this.sort = 1;
    this.valueFormat = (d) => {
      let v = d.value;
      if (v == undefined) v = d;
      if (String(d).indexOf(".") > -1) return `${format(",.2f")(v)}`;
      return `${format(",d")(v)}`;
    };

    this.tickFormat = (val) =>
      new Intl.NumberFormat(this.language, { notation: "compact" }).format(val);

    this.dateFormat = "%Y-%m-%d %H:%M";

    this.listImageSrc = () => [];

    this.imageData = {};

    this.colorScheme = {
      background: "#1E1E1E",
      colors: [
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
      ],
    };

    this.useCtl = false;

    this.colorGener = (function* (cs) {
      let i = 0;
      while (true) {
        yield cs.colors[i++ % cs.colors.length];
      }
    })(this.colorScheme);

    this.numberKey = new Set();

    this.ready = false;
    this.innerMargin = {
      left: this.outerMargin.left,
      right: this.outerMargin.right,
      top: this.outerMargin.top,
      bottom: this.outerMargin.bottom,
    };

    this.drawBarExt = (ctx, data, series, self) => {};
    this.drawExt = (ctx, data, series, self) => {};
    this.setOptions(options);

    this.barHeight = Math.round(
      ((this.height - this.innerMargin.top - this.innerMargin.bottom) /
        this.itemCount) *
        0.8
    );
  }

  async loadMetaData(path) {
    let metaData = await this.readCsv(path);
    metaData = metaData.reduce((pv, cv) => {
      pv[cv[this.idField]] = { ...cv };
      return pv;
    }, {});
    if (metaData != undefined) {
      this.metaData = metaData;
    }
  }

  async readCsv(path) {
    if (typeof window == "undefined") {
      fs = require("fs");
      return csvParse(fs.readFileSync(path).toString());
    } else {
      if ("object" == typeof path) {
        return csv(path.default);
      }
      return await csv(path);
    }
  }

  async loadCsv(path) {
    this.data = [];
    let csvData = await this.readCsv(path);
    let tsList = [...group(csvData, (d) => d.date).keys()]
      .map(
        (d) =>
          new Date().getTimezoneOffset() * 60 * 1000 + new Date(d).getTime()
      )
      .sort((a, b) => a - b);
    let delta = (() => {
      let d = Infinity;
      for (let i = 1; i < tsList.length; i++) {
        const c = tsList[i];
        const p = tsList[i - 1];
        if (c - p < d) d = c - p;
      }
      return d;
    })();
    if (this.keyFrameDeltaTime != undefined)
      delta = this.keyFrameDeltaTime * 1000;

    let firstTs = tsList[0];
    let lastTs = tsList[tsList.length - 1];
    tsList = range(firstTs, lastTs + 1, delta);
    let frameCount = this.frameRate * this.interval * (tsList.length - 1);

    this.getCurrentDate = scaleLinear()
      .domain([0, frameCount - 1])
      .range([firstTs, lastTs])
      .clamp(true);

    csvData.forEach((d) => {
      if (this.id == undefined) this.id = d.name;
      d.date =
        new Date().getTimezoneOffset() * 60 * 1000 + new Date(d.date).getTime();
      d.value = +d.value;
    });
    let temp = group(
      csvData,
      (d) => d[this.idField],
      (d) => d.date
    );
    // 对每一个项目
    for (let [id, data] of temp) {
      let dtList = [...data.keys()].sort((a, b) => a - b);
      let valList = [...data.values()]
        .map((d) => d[0])
        .sort((a, b) => a.date - b.date);
      let scales = {};
      for (let i = 0; i < valList.length; i++) {
        _.keys(valList[0]).forEach((key) => {
          if (
            valList[0][key] != id &&
            Number(valList[0][key]) == Number(valList[0][key]) &&
            Number(valList[0][key]) != 0
          ) {
            this.numberKey.add(key);
          }
        });
        const element = valList[i];
      }
      this.numberKey.forEach((key) => {
        scales[key] = scaleLinear()
          .domain(dtList)
          .range(valList.map((d) => d[key]));
      });
      const startDt = dtList[0];
      let obj = valList[0];
      // 对每一个关键帧
      for (let i = 0; i < tsList.length; i++) {
        if (valList[i] != undefined) obj = valList[i];
        let ct = tsList[i];
        if (ct <= dtList[dtList.length - 1] && ct >= dtList[0]) {
          // 在区间内
          obj = { ...obj };
          _.keys(scales).forEach((key) => {
            obj[key] = scales[key](Number(ct));
          });
          obj.date = ct;
        } else {
          obj = { ...obj };
          _.keys(scales).forEach((key) => {
            obj[key] = NaN;
          });
          obj.date = ct;
        }
        this.data.push(obj);
      }
    }
    this.keyFramesCount = tsList.length;
    this.setKeyFramesInfo();
    this.tsToFi = scaleLinear()
      .domain(extent(tsList))
      .range([0, this.totalTrueFrames])
      .clamp(true);
    this.fiToTs = scaleLinear()
      .range(extent(tsList))
      .domain([0, this.totalTrueFrames])
      .clamp(true);
  }

  calculateFrameData(data) {
    let frameData = [];
    let idSet = new Set();
    this.maxValue = -Infinity;
    this.minValue = Infinity;
    const group = d3.group(data, (d) => d[this.idField]);
    const dataScales = new Map();
    group.forEach((items, id) => {
      const scales = new Map();
      const dateList = d3.map(items, (d) => d.date);
      const alphaList = d3.map(items, (d) => 1);
      const posList = d3.map(items, (d) => 0);
      this.numberKey.forEach((key) => {
        const valueList = d3.map(items, (d) => d[key]);
        for (let i = 1; i < valueList.length - 1; i++) {
          if (valueList[i] === valueList[i]) {
            if (valueList[i - 1] !== valueList[i - 1]) {
              valueList[i - 1] = valueList[i] * 0.98;
              alphaList[i - 1] = 0;
              posList[i - 1] = 1;
            }
          } else if (valueList[i - 1] === valueList[i - 1]) {
            valueList[i] = valueList[i - 1] * 1.02;
            alphaList[i] = 1;
          }
        }
        scales.set(key, d3.scaleLinear(dateList, valueList).clamp(true));
      });
      scales.set("alpha", d3.scaleLinear(dateList, alphaList).clamp(true));
      scales.set("pos", d3.scaleLinear(dateList, posList).clamp(true));
      dataScales.set(id, scales);
    });
    this.dataScales = dataScales;
    frameData = d3.range(0, this.totalTrueFrames).map((f) => {
      let data = [];
      let ts = this.fiToTs(f);
      this.dataScales.forEach((v, k) => {
        let obj = {};
        obj[this.idField] = k;
        v.forEach((scale, name) => {
          if (name == "alpha") {
            obj[name] = d3.easePolyOut.exponent(20)(scale(ts));
          } else if (name == "pos") {
            obj[name] = d3.easePolyIn.exponent(20)(scale(ts));
          } else {
            obj[name] = scale(ts);
          }
        });
        if (obj.value === obj.value) {
          data.push(obj);
        }
      });
      data.max = d3.max(data, (d) => d.value);
      data.min = d3.min(data, (d) => d.value);
      data
        .sort((a, b) => b.value - a.value)
        .forEach((d, i) => {
          d.rank = i;
        });
      return data;
    });

    this.frameData = frameData;
    this.idSet = this.dataScales.keys();
  }

  setKeyFramesInfo() {
    this.totalTrueFrames =
      (this.keyFramesCount - 1) * this.frameRate * this.interval;
    this.keyFrames = range(
      0,
      this.totalTrueFrames,
      this.frameRate * this.interval
    );
  }

  async preRender() {
    await this.hintText("Loading Layout", this);
    this.innerMargin.top += this.axisTextSize;

    this.ctx.font = `${this.barHeight}px Sarasa Mono SC`;

    this.innerMargin.left += this.labelPandding;
    let w1 = this.ctx.measureText(
      this.valueFormat(d3.max(this.data, (d) => d.value))
    ).width;
    let w2 = this.ctx.measureText(
      this.valueFormat(d3.min(this.data, (d) => d.value))
    ).width;
    this.innerMargin.right += max([w1, w2]);
    this.innerMargin.right += this.labelPandding;

    let maxTextWidth = max(this.frameData, (fd) =>
      max(
        fd,
        (d) => this.ctx.measureText(this.label(d, this.metaData, this)).width
      )
    );
    this.innerMargin.left += maxTextWidth;
    this.currentFrame = 0;

    this.ctx.drawBar = (data, series) => {
      this.ctx.fillStyle = "#999";
      let fillColor = this.getColor(data);
      let barWidth = series.xScale(data.value);
      let r = this.barRedius > barWidth / 2 ? barWidth / 2 : this.barRedius;
      let imgPandding =
        this.imageData[data[this.idField]] == undefined ? 0 : this.barHeight;
      this.ctx.globalAlpha = data.alpha;

      let x = this.innerMargin.left;
      let y = series.yScale(data.pos);
      // draw rect
      this.ctx.fillStyle = fillColor;
      this.ctx.radiusRect(x, y, barWidth, this.barHeight, r);

      // draw bar label text
      this.ctx.fillStyle = fillColor;
      this.ctx.font = `900 ${this.barHeight}px Sarasa Mono SC`;
      this.ctx.textAlign = "right";
      this.ctx.fillText(
        this.label(data, this.metaData, this),
        x - this.labelPandding,
        y + this.barHeight * 0.88
      );

      // draw bar value text
      this.ctx.textAlign = "left";
      this.ctx.fillText(
        this.valueFormat(data),
        barWidth + x + this.labelPandding,
        y + this.barHeight * 0.88
      );

      // draw bar info
      this.ctx.save();

      // clip bar info
      this.ctx.beginPath();
      this.ctx.radiusArea(x, y, barWidth, this.barHeight, r);
      this.ctx.clip(); //call the clip method so the next render is clipped in last path
      this.ctx.closePath();

      // draw bar text
      this.ctx.textAlign = "right";
      this.ctx.fillStyle = this.colorScheme.background;
      this.ctx.font = `900 ${this.barHeight}px Sarasa Mono SC`;
      this.ctx.fillText(
        this.barInfo(data, this.metaData, this),
        barWidth + x - this.labelPandding - imgPandding,
        y + this.barHeight * 0.88
      );
      // draw bar img
      this.ctx.drawClipedImg(
        this.imageData[data[this.idField]],
        x + series.xScale(data.value) - this.barHeight,
        y,
        this.barHeight,
        this.barHeight,
        4
      );

      this.ctx.restore();

      this.drawBarExt(this.ctx, data, series, this);

      this.ctx.globalAlpha = 1;
    };
  }

  async autoGetColorFromImage(key, src) {
    const rgbToHex = (r, g, b) =>
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");
    if (this.colorData[key] == undefined) {
      if (typeof window == "undefined") {
        let color = await this.colorThief.getColor(src);
        this.colorData[key] = rgbToHex(...color);
      } else {
        if (this.imageData[key].complete) {
          let color = this.colorThief.getColor(this.imageData[key]);
          this.colorData[key] = rgbToHex(...color);
        } else {
          this.imageData[key].addEventListener("load", () => {
            let color = this.colorThief.getColor(this.imageData[key]);
            this.colorData[key] = rgbToHex(...color);
          });
        }
      }
    }
  }

  /**
   * Convolution 卷积
   *
   * @param {Set} idSet
   * @param {List} frameData
   */
  calPosition(idSet, frameData) {
    for (let __ of range(this.freeze + this.frameRate * this.interval)) {
      frameData.push(_.cloneDeep(frameData[this.totalTrueFrames - 1]));
      frameData[frameData.length - 1].max =
        frameData[this.totalTrueFrames - 1].max;
      frameData[frameData.length - 1].min =
        frameData[this.totalTrueFrames - 1].min;
    }
    let tempDict = [...idSet].reduce((dict, id) => {
      let rankList = frameData.map((dList) => {
        for (let d of dList) {
          if (d[this.idField] != id) {
            continue;
          }
          return d.rank;
        }
      });

      // 修复突变
      for (let i = 1; i < rankList.length - 1; i++) {
        if (rankList[i - 1] == rankList[i + 1]) rankList[i] = rankList[i - 1];
      }
      // 修复首位
      if (rankList[0] != rankList[1]) rankList[0] = rankList[1];

      let tmpList = [];
      for (let i = 0; i < rankList.length; i++) {
        let frames = (this.frameRate * this.interval) / 7;
        let tmpArray = rankList.slice(
          i - frames > 0 ? i - frames : 0,
          i + frames
        );
        let m = mean(tmpArray);
        // 优化条目变换的缓动效果
        tmpList[i] = easePolyInOut.exponent(1.5)(m % 1) + Math.floor(m);
      }
      dict[id] = tmpList;
      return dict;
    }, {});
    for (let i = 0; i < frameData.length; i++) {
      const e = frameData[i];
      for (let j = 0; j < e.length; j++) {
        const d = e[j];
        d.pos += tempDict[d[this.idField]][i];
      }
    }
  }
  getKeyFrame(i) {
    let idx = i / (this.interval * this.frameRate);
    let idx1 = Math.floor(idx); // 下限
    let idx2 = Math.ceil(idx);
    return [idx1, idx2];
  }

  calScale() {
    this.tickArrays = this.keyFrames.map((f) => {
      let scale = scaleLinear()
        .domain(this.xDomain(this.frameData[f]))
        .range([
          0,
          this.width - this.innerMargin.left - this.innerMargin.right,
        ]);
      return scale.ticks(this.tickNumber);
    });
    this.frameData.forEach((f, i) => {
      f.yScale = scaleLinear()
        .domain([0, this.itemCount])
        .range([this.innerMargin.top, this.height - this.innerMargin.bottom]);
      f.xScale = scaleLinear()
        .domain(this.xDomain(f))
        .range([
          0,
          this.width - this.innerMargin.left - this.innerMargin.right,
        ]);
    });
  }
  drawAxis(n, cData) {
    let xScale = cData.xScale;
    let idx = n / (this.interval * this.frameRate);
    let [idx1, idx2] = this.getKeyFrame(n);
    while (idx1 >= this.tickArrays.length) idx1 -= 1;
    if (idx2 >= this.tickArrays.length) idx2 = idx1;
    let a = easePolyInOut.exponent(10)(idx % 1);
    let mainTicks = this.tickArrays[idx1];
    let secondTicks = this.tickArrays[idx2];
    this.ctx.save();
    this.ctx.translate(0, this.outerMargin.top - 10);
    this.ctx.globalAlpha = max(mainTicks) == max(secondTicks) ? 1 : a;
    this.ctx.font = `${this.axisTextSize}px Sarasa Mono SC`;
    this.ctx.fillStyle = "#888";
    this.ctx.strokeStyle = "#888";
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = "center";
    secondTicks.forEach((val) => {
      // this.drawTick(xScale, val);
      this.ctx.fillText(
        this.tickFormat(val),
        this.innerMargin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = max(mainTicks) == max(secondTicks) ? 1 : 1 - a;
    mainTicks.forEach((val) => {
      // this.drawTick(xScale, val);
      this.ctx.fillText(
        this.tickFormat(val),
        this.innerMargin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = 0;
    this.ctx.restore();
  }
  drawTick(xScale, val) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.innerMargin.left + xScale(val), this.innerMargin.top);
    this.ctx.lineTo(
      this.innerMargin.left + xScale(val),
      this.height - this.innerMargin.bottom
    );
    this.ctx.stroke();
  }

  drawWatermark() {
    this.ctx.textAlign = "right";
    this.ctx.font = `${this.slogenSize}px Sarasa Mono SC`;

    this.ctx.fillStyle = "#fff4";
    this.ctx.fillText(
      "Powered by Jannchie Studio",
      // window.atob("UE9XRVIgQlkgSkFOTkNISUU="),
      this.width - this.outerMargin.left,
      this.height - this.outerMargin.bottom
    );
  }

  async drawFrame(n) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let cData = this.frameData[n];
    this.drawBackground();
    this.drawWatermark();
    this.drawAxis(n, cData);
    this.drawDate(n);
    cData.forEach((e) => {
      this.ctx.drawBar(e, cData);
    });
    this.drawExt(this.ctx, cData, this);
  }

  drawDate(n) {
    let timestamp = this.getCurrentDate(n);
    this.ctx.textAlign = "right";
    this.ctx.font = `${this.dateLabelSize}px Sarasa Mono SC`;
    this.ctx.fillStyle = "#fff4";
    this.ctx.fillText(
      timeFormat(this.dateFormat)(new Date(timestamp)),
      this.width - this.outerMargin.left,
      this.height - this.outerMargin.bottom - this.slogenSize - 4
    );
  }

  drawBackground() {
    this.ctx.fillStyle = this.colorScheme.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  downloadBlob(blob, name = "untitled.mp4") {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `${name}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  calRenderSort() {
    // 调整渲染顺序
    for (let i = 0; i < this.frameData.length; i++) {
      const e = this.frameData[i];
      let t = i == this.frameData.length - 1 ? i : i + 1;
      let afterDict = this.frameData[t].reduce((pv, cv) => {
        pv[cv[this.idField]] = cv.pos;
        return pv;
      }, {});
      e.sort((a, b) => {
        // a上升
        if (
          afterDict[a[this.idField]] - a.pos < 0 ||
          afterDict[b[this.idField]] - b.pos > 0
        ) {
          return 1;
        }
        return -1;
      });
    }
  }

  async fixAlpha() {
    for (let fd of this.frameData) {
      for (let data of fd) {
        if (data.pos > this.itemCount - 1) {
          let newAlpha = scaleLinear().domain([0, 1]).range([1, 0]).clamp(true)(
            data.pos - this.itemCount + 1
          );
          if (data.alpha > newAlpha) data.alpha = newAlpha;
        }
      }
    }
  }
}
export default BarChart;
