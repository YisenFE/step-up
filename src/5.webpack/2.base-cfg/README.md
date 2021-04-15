# 基础配置
在1.base-ts基础上配置

新建目录`public`，新建文件`public/index.html`，编写html模版内容

### 1.支持sass
```sh
yarn add -D sass
```
### 2.添加loader

编译sass
```sh
# sass-loader 将.scss文件编译为.css文件，依赖核心模块sass
# css-loader 是处理css文件，具体处理了啥不太清楚
# style-loader 将css插入到页面的style标签
yarn add -D sass-loader css-loader style-loader
```
更改配置文件
```typescript
{
    rules: [
        { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
    ]
}
```

```sh
# 查看编译结果
yarn build
```

### 3.添加插件
```sh
yarn add -D html-webpack-plugin clean-webpack-plugin mini-css-extract-plugin

yarn add -D @types/mini-css-extract-plugin

# 使用MiniCssExtractPlugin插件后不需要style-loader
yarn remove style-loader
```
更改配置文件
```typescript
{
    rules: [
        { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        {
                test: /.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: assetsPublicPath
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ]
            },
    ]
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: assetsPath('css/[name].css')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html'
        })
    ]
}
```

```sh
# 查看编译结果
yarn build
```

### 4.开发环境配置
```sh
yarn add -D webpack-dev-server @types/webpack-dev-server
```
```typescript
{
    devtool: 'inline-source-map',
    devServer: {
        // contentBase: './dist',
        host: '0.0.0.0',
        port: 3500,
        // hot: true,
        // compress: false,
    }
}
```

### 5.package.json添加脚本
```json
{
  "name": "2.base-cfg",
  "private": true,
  "scripts": {
    "build": "NODE_ENV=none webpack",
    "dev": "NODE_ENV=none webpack serve"
  },
  "devDependencies": { ... }
}
```
```sh
# 查看编译结果
yarn dev
```

### 6.处理静态资源

```typescript
{

    rules: [
        { ... },
        { ... },
        {
            test: {
                or: [
                    /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                ]
            },
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 4 * 1024 // 4KB
                }
            },
            generator: {
                publicPath: '../'
            }
        }
    ]
}
```

