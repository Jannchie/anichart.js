const d3 = require("d3");
const loadImages = require("./image");
const Ctl = require("./ctl");
const _ = require("lodash");
const { ffmpeg, pngToMp4 } = require("./ffmpeg");
class AniBarChart {
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

  async initCanvas(parent = "body") {
    if (typeof window != "undefined") {
      this.canvas = d3
        .select(parent)
        .append("canvas")
        .attr("width", this.width)
        .attr("height", this.height)
        .node();
    } else {
      const { createCanvas } = require("canvas");
      this.canvas = createCanvas(this.width, this.height);
    }
    this.ctx = this.canvas.getContext("2d");
    this.ctx.drawClipedImg = (
      img,
      x = 0,
      y = 0,
      imageHeight = 100,
      imageWidth = 100,
      r = 4
    ) => {
      if (img != undefined) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.radiusArea(x, y, imageWidth, imageHeight, r);
        this.ctx.clip(); //call the clip method so the next render is clipped in last path
        this.ctx.closePath();
        try {
          this.ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            x,
            y,
            imageWidth,
            imageHeight
          );
        } catch (error) {
          console.log(error);
        }
        this.ctx.strokeStyle = this.colorScheme.background;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
      }
    };

    this.ctx.radiusArea = (left, top, w, h, r) => {
      this.ctx.lineWidth = 0;
      const pi = Math.PI;
      this.ctx.arc(left + r, top + r, r, -pi, -pi / 2);
      this.ctx.arc(left + w - r, top + r, r, -pi / 2, 0);
      this.ctx.arc(left + w - r, top + h - r, r, 0, pi / 2);
      this.ctx.arc(left + r, top + h - r, r, pi / 2, pi);
    };
    this.ctx.radiusRect = (left, top, w, h, r) => {
      this.ctx.beginPath();
      this.ctx.radiusArea(left, top, w, h, r);
      this.ctx.closePath();
      this.ctx.fill();
    };
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
            let btn = d3.select("#play-btn");
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
      this.player = d3.interval(async () => {
        await playFrame();
      }, delay);
    }
  }

  async readyToDraw() {
    await loadImages(this.metaData, this.imageDict, this.imageData, this);
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
  async outputPngs() {
    if (typeof window != "undefined") {
      console.log("Do not out pngs in browser!");
      return;
    }
    for (let f in d3.range(this.frameData.length)) {
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
module.exports = AniBarChart;
