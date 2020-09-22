# anichart.js

轻松地制作数据可视化动画视频。

## 简介

这是一个更好的可视化模板。

相较于它的[前身](https://github.com/Jannchie/Historical-ranking-data-visualization-based-on-d3.js)，主要优势在于：

- 高效绘图：采用Canvas而不是Svg，更加节能。
- 直出视频：可以直接通过每一帧的图像渲染视频，无需借助任何录屏工具。
- 帧率可控：逐帧绘图，导出视频而不会掉帧。
- 逐帧调试：提供组件进行逐帧调试和播放。
- 任意分辨率：能够导出任何分辨率而无需后期处理。

## 安装

### 使用Yarn

```bash
yarn add anichart
```

### 使用Npm

```bash
npm i anichart
```

### 标签导入

```html
<script src="./anichart.js"></script>
```

## 用法

### 使用Npm或者Yarn导入

如果使用标签导入可以跳过这一步，如果使用npm或者Yarn需要通过以下代码引入包：

``` js
import * as anichart from "anichart";
```

### 准备数据

```js
let data = [
  {
    name: "我TM超长",
    value: [1, 1, 4, 5, 6, 12],
    color: "#CC342B",
    image:
      "https://i2.hdslb.com/bfs/face/983034448f81f45f05956d0455a86fe0639d6a36.jpg@80w_80h.jpg",
  },
  { name: "B", value: [1, 2, 3, 4, 52, 13], color: "#198844" },
  {
    name: "D",
    value: [1, 3, 4, 5, 62, 7],
    color: "#3971ED",
    image:
      "https://i1.hdslb.com/bfs/face/2254162161a60b528cfec449f3450409a81ebc37.jpg@80w_80h.jpg",
  },
  {
    name: "E",
    value: [undefined, 3.3, undefined, undefined, undefined, undefined],
    color: "white",
  },
  {
    name: "F",
    value: [undefined, undefined, 2, 1, 512, 52563],
    color: "#3971ED",
  },
  {
    name: "G",
    value: [undefined, 7, 1, 2, undefined, 52],
    color: "yellow",
  },
  { name: "H", value: [undefined, 1, 1, 2, 52, 64], color: "orange" },
];
```

### 载入数据

```js
let a = new anichart.Bar(data);
```

### 播放动画

```js
a.play();
```
