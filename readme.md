# anichart.js

轻松地制作数据可视化动画视频。

## 简介

这是一个更好的可视化模板。

相较于它的[前身](https://github.com/Jannchie/Historical-ranking-data-visualization-based-on-d3.js)，主要优势在于：

- 高效绘图：采用Canvas而不是Svg，更加节能。
- 直出视频：可以直接通过每一帧的图像渲染视频，无需借助任何录屏工具。
- 帧率可控：逐帧绘图，导出视频而不会掉帧。
- 逐帧调试：提供组件进行逐帧调试和播放。
- 任意比例：能够导出任何分辨率而无需后期处理。
- 自带插值：提供了更加友好的数据预处理
  
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

``` csv
name,date,value,channel,other
Jannchie,2020-01-01,1,科技,other
Jannchie,2020-01-03,6,科技,other
Jannchie,2020-01-05,3,科技,other
Jannchie,2020-01-07,-,科技,other
Jannchie,2020-01-09,7,科技,other
Jannchie,2020-01-12,12,科技,other
Cake47,2020-01-03,10,生活,other
Cake47,2020-01-02,5,生活,other
Cake47,2020-01-06,2,生活,other
Cake47,2020-01-09,3,生活,other
Cake47,2020-01-11,4,生活,other
```

### 载入数据

```js
let a = new anichart.Bar(data);
let a = a.loadCsv(path);
```

### 播放动画

```js
a.play();
```
