// Types
import { Configuration } from 'webpack';

// Modules
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const devMode = process.env.NODE_ENV !== 'production';
const assetRoot = './dist';

const config: Configuration = {
    mode: process.env.NODE_ENV as "production" | "development" | "none" | undefined,
    entry: {
        index: './src/index.ts',
        another: './src/another-module.ts'
    },
    // entry: {
    //     page: ['./src/index.ts', './src/another-module.ts']
    // },
    output: {
        path: path.resolve(__dirname, assetRoot),
        filename: devMode
            ? 'js/[name].js'
            : 'js/[name].[fullhash:7].js',
        chunkFilename: 'chunk/[id].[fullhash:7].js',
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true
    },
    // 构建目标 https://webpack.docschina.org/configuration/target/#root
    // NOTE: 使用es5 对于多入口但页面应用有bug
    target: 'browserslist',
    devtool: 'inline-source-map',
    devServer: {
        // contentBase: './dist',
        host: '0.0.0.0',
        port: 3500,
        // hot: true,
        // compress: false,
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
            {
                test: /.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/'
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ]
            },
            // 配置参考 https://webpack.docschina.org/guides/asset-modules/
            {
                test: {
                    or: [
                        /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                        /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                        /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    ]
                },
                type: 'asset',
                // https://webpack.docschina.org/configuration/module/#ruleparserdataurlcondition
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4KB
                    }
                },
                // https://webpack.docschina.org/configuration/module/#rulegenerator
                generator: {
                    publicPath: '../'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html'
        })
    ],
    optimization: {
        // https://webpack.js.org/guides/code-splitting/#entry-dependencies
        runtimeChunk: 'single'
    }
};

export default config;
