# ts版本 webpack 基础环境搭建
## 项目初始化

```sh
yarn init -y

yarn add -D webpack webpack-cli typescript ts-loader

# 使用webpack.config.ts
yarn add -D ts-node
```

### 1. 生成`tsconfig.json`文件

```sh
yarn tsc --init --target esnext --allowJs false --outDir './dist' --experimentalDecorators true --resolveJsonModule true
```
添加`exclude`
```json
{
    "compilerOptions": { ... },
    "exclude": [
        "**/*.spec.ts",
        "**/*.spec.js",
        "node_modules"
      ]
}
```

### 3.src
新建scr目录，在新建文件`src/index.ts`

### 4.编写webpack.config.ts
项目根目录创建`webpack.config.ts`，内容如下：
```typescript
// Types
import { Configuration } from 'webpack';

// Modules
import path from 'path';

const env = process.env.NODE_ENV as 'development' | 'production' | 'none' | undefined;
const config: Configuration = {
    mode: env,
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    // 构建目标 https://webpack.docschina.org/configuration/target/#root
    target: 'es5',
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};

export default config;
```

### 5.package.json添加脚本
```json
{
  "name": "1.base-ts",
  "private": true,
  "scripts": {
    "build": "NODE_ENV=none webpack"
  },
  "devDependencies": { ... }
}
```