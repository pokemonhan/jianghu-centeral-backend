
# totalContral 总控后台

> A Vue.js project

## Build Setup
``` bash
# install dependencies 安装依赖(需要有安装npm)
npm install

# build 打包(打好的包在/dist文件里)

# build 默认打包地址 测试内网(http://api.jianghu.local)
npm run build

# outer 测试外网(http://api.397017.com)
npm run build -- outer

# stg 筹划地址 stg(http://apistg.397017.com)
npm run build -- stg

# ethan (http://api.jianghu.ethan)
npm run build -- ethan

# 任意网址 ,例如 npm run build -- http://abc.com ，那么 api地址为 http://abc.com
npm run build -- https://xxx.com
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
