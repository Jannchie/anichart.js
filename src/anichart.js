import loadImages from "./image";
import Ctl from "./ctl";
import * as _ from "lodash-es";
import { ffmpeg, pngToMp4 } from "./ffmpeg";
import { select, selectAll } from "d3-selection";
import { range } from "d3-array";
import { interval } from "d3-timer";
import enhanceCtx from "./ctx";
class BaseAniChart {
  constructor() {
    this.metaData = [];
    this.data = [];
    this.ffmpeg = ffmpeg;
    this.pngToMp4 = pngToMp4;
  }
  setOptions(options) {
    _.merge(this, options);
    this.innerMargin = {
      left: this.outerMargin.left,
      right: this.outerMargin.right,
      top: this.outerMargin.top,
      bottom: this.outerMargin.bottom,
    };
  }
  loadImages(metaData, imgDict, imgData) {
    return loadImages(metaData, imgDict, imgData, this);
  }
  imageDict() {
    return Object();
  }

  getColor(data) {
    return this.colorData[this.colorKey(data, this.metaData, this)];
  }

  label(data) {
    if (data.name != undefined) {
      return data.name;
    } else {
      return data[this.idField];
    }
  }

  colorKey(data) {
    return data[this.idField];
  }

  async selectCanvas(selector = "canvas") {
    if (typeof window != "undefined") {
      this.canvas = select(selector).node();
    } else {
      this.initCanvas();
    }
    this.ctx = this.canvas.getContext("2d");
    console.log(enhanceCtx);
    enhanceCtx(this.ctx);
  }

  async initCanvas(parent = "body") {
    if (typeof window != "undefined") {
      this.canvas = select(parent)
        .append("canvas")
        .attr("width", this.width)
        .attr("height", this.height)
        .node();
    } else {
      const { createCanvas } = require("canvas");
      this.canvas = createCanvas(this.width, this.height);
    }
    this.ctx = this.canvas.getContext("2d");
    enhanceCtx(this.ctx);
  }

  async hintText(txt, self = this) {
    console.log(txt);
    self.ctx.textAlign = "left";
    self.ctx.fillStyle = self.colorScheme.background;
    self.ctx.fillRect(0, 0, self.width, self.height);
    self.ctx.fillStyle = "#fff";
    self.ctx.font = `20px Sarasa Mono SC`;
    self.ctx.fillText(txt, 20, 30);
    self.drawWatermark();
  }

  async play() {
    if (this.player) {
      this.player.stop();
      this.player = false;
      return;
    }
    if (!this.ready) {
      await this.readyToDraw();
    }
    if (this.output) {
      await ffmpeg.load();
    }

    let delay = this.output ? 0 : 1000 / this.frameRate;
    let playFrame = async () => {
      try {
        if (this.useCtl) {
          this.ctl.slider.value = this.currentFrame;
          this.ctl.updatectlCurrentFrame(this);
        }
        await this.drawFrame(this.currentFrame);
        if (this.output) {
          await ffmpeg.write(
            `${this.outputName}-${this.currentFrame}.png`,
            this.canvas.toDataURL("image/png", 1)
          );
        }
        if (this.currentFrame == this.frameData.length - 1) {
          if (this.useCtl) {
            let btn = select("#play-btn");
            btn.text(btn.text() == "STOP" ? "PLAY" : "STOP");
          }
          if (this.output) {
            await this.ffmpeg.run(
              `-r ${this.frameRate} -threads ${16} -i ${
                this.outputName
              }-%d.png ${this.outputName}.mp4`
            );
            let data = await ffmpeg.read(`./${this.outputName}.mp4`);
            this.downloadBlob(
              new Blob([data.buffer], { type: "video/mp4" }),
              this.outputName
            );
          }
          await this.player.stop();
          return;
        } else {
          this.currentFrame++;
        }
      } catch (e) {
        console.error(e);
        this.player.stop();
      }
    };

    if (this.output) {
      const len = this.frameData.length;
      while (this.currentFrame < len) {
        await playFrame();
      }
    } else {
      this.player = interval(async () => {
        await playFrame();
      }, delay);
    }
  }

  async readyToDraw() {
    await this.loadImages(this.metaData, this.imageDict, this.imageData);
    await this.hintText("Loading Data", this);
    this.calculateFrameData(this.data);
    this.calPosition(this.idSet, this.frameData);

    await this.preRender();
    await this.fixAlpha(this.frameData);
    this.calScale();

    this.calRenderSort();
    if (typeof window == "undefined") {
      this.useCtl = false;
    }
    if (this.useCtl) {
      this.ctl = new Ctl();
      this.ctl.addCtl(this);
    }
    this.ready = true;
    if (typeof window == "undefined") {
      console.log(`Total Frames: ${this.frameData.length}`);
      this.outputPngs();
      this.outputMp4();
    }
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

  async outputPngs() {
    if (typeof window != "undefined") {
      console.log("Do not out pngs in browser!");
      return;
    }
    for (let f in range(this.frameData.length)) {
      this.currentFrame = f;
      let fs = require("fs");
      let path = require("path");
      this.outputPng(f, this.outputName, fs, path);
    }
  }

  async outputMp4() {
    if (typeof window != "undefined") {
      console.log("Do not out Mp4 from Pngs in browser!");
      return;
    }
    await pngToMp4(this.imagePath, this.outputName, this.frameRate);
  }

  async outputPng(n, name, fs, path) {
    if (typeof window != "undefined") {
      console.log("Cannot output png in browser!");
      this.canvas.toBlob((b) => this.downloadBlob(b, `${name}.png`));
    } else {
      function delDir(path) {
        let files = [];
        if (fs.existsSync(path)) {
          files = fs.readdirSync(path);
          files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
              delDir(curPath); //递归删除文件夹
            } else {
              fs.unlinkSync(curPath); //删除文件
            }
          });
          fs.rmdirSync(path);
        }
      }
      async function mkdirPath(pathStr) {
        var projectPath = path.join(process.cwd());
        var tempDirArray = pathStr.split("\\");
        for (var i = 0; i < tempDirArray.length; i++) {
          projectPath = projectPath + "/" + tempDirArray[i];
          if (fs.existsSync(projectPath)) {
            var tempstats = fs.statSync(projectPath);
            if (!tempstats.isDirectory()) {
              fs.unlinkSync(projectPath);
              fs.mkdirSync(projectPath);
            }
          } else {
            fs.mkdirSync(projectPath);
          }
        }
      }
      delDir(this.imagePath);
      await mkdirPath(this.imagePath);
      this.drawFrame(n);
      this.currentFrame = n;
      // window.a = a;
      console.log(`output frame: ${n}, name: ${name}`);
      // string generated by canvas.toDataURL()
      var img = this.canvas.toDataURL();
      // strip off the data: url prefix to get just the base64-encoded bytes
      var data = img.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer.from(data, "base64");
      fs.writeFileSync(`${this.imagePath}${name}-${n}.png`, buf);
    }
  }
}
export { BaseAniChart };
