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
