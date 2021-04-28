// Types
import { Configuration } from 'webpack';

// Modules
import path from 'path';

const config: Configuration = {
    mode: 'none',
    entry: './src/index.ts',
    optimization: {
        usedExports: true
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    // 构建目标 https://webpack.docschina.org/configuration/target/#root
    // NOTE: 使用es5 对于多入口但页面应用有bug
    target: 'browserslist',
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
