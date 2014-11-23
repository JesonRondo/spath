# 前端解决方案

### 目录结构

    spath
     |-- app 项目
     |    |-- m.demo.com 业务线1
     |    `-- www.demo.com 业务线2
     |-- component 公共组件
     |-- config 配置相关
     |-- core PHP驱动框架
     |-- guide 前端规范
     |-- lib 基础库
     `-- static 图片资源

### 工具

##### 自动刷新

    chrome plugin - livereload

    grunt live

#### 合并压缩

    https://minify.googlecode.com/files/minify-2.1.7.zip

#### 发布

    grunt deploy

### 开始

    http://www.demo.com/home

### 更新

2014/11/23

* 添加模拟数据
* 添加正式环境模式
* PHP Minify

2014/11/22

* 移除多余项目
* 解决本地开发资源文件加载问题
* 添加全局资源路径变量
* 添加livereload工具
* 顺便换了一个HK的VPS
