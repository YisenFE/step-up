// Types
import { Configuration, Module, Chunk, NormalModule } from 'webpack';

// Modules
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// https://webpack.docschina.org/guides/code-splitting/#bundle-analysis
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const devMode = process.env.NODE_ENV !== 'production';
const assetRoot = './dist';

const config: Configuration = {
    mode: process.env.NODE_ENV as "production" | "development" | "none" | undefined,
    entry: {
        index: './src/index.ts',
        another: './src/another-module.ts'
    },
    output: {
        path: path.resolve(__dirname, assetRoot),
        filename: devMode
            ? 'js/[name].[contenthash].js'
            : 'js/[name].[contenthash].js',
        // assetModuleFilename: 'assets/[hash][ext][query]',
        assetModuleFilename: 'assets/[contenthash][ext]',
        clean: true
    },
    // 构建目标 https://webpack.docschina.org/configuration/target/#root
    // NOTE: 使用es5 对于多入口但页面应用有bug
    target: 'browserslist',
    devtool: 'inline-source-map',
    stats: 'normal',
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
                        // /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                        // /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    ]
                },
                type: 'asset/inline',
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
        }),
        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        // https://webpack.js.org/guides/code-splitting/#entry-dependencies
        runtimeChunk: 'single',
        // https://webpack.docschina.org/guides/caching/#module-identifiers
        moduleIds: 'deterministic',
        // chunkIds: 'deterministic',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: 'all',
                    priority: -20,
                    test: /[\\/]node_modules[\\/]/,
                    // name: 'vendors',
                    name(module: NormalModule, chunks: Chunk[], cacheGroupKey: string) {
                        const moduleFileName = module
                            .identifier()
                            .split('/')
                            .reduceRight((item) => item)
                            .replace(/\.js$/, '');
                        const allChunksNames = chunks.map((item) => item.name).join('~');
                        return `${allChunksNames ? allChunksNames + '-' : ''}${moduleFileName}`;
                    },
                    filename: (pathData, assetInfo) => {
                        const isInitial = (pathData.chunk as Chunk).canBeInitial();
                        return `js/vendors/${isInitial ? 'initial' : 'async'}/[name].[contenthash].js`;
                    }
                },
                commons: {
                    minChunks: 2,
                    chunks: 'all',
                    priority: -20,
                    minSize: 0,
                    test: (module: NormalModule) => !/[\\/]node_modules[\\/]/.test(module.resource),
                    name(module: NormalModule, chunks: Chunk[], cacheGroupKey: string) {
                        const moduleFileName = module
                            .identifier()
                            .split('/')
                            .reduceRight((item) => item)
                            .replace(/\.[t|j]sx?$/, '');
                        const allChunksNames = chunks.map((item) => item.name).join('~');
                        return `${allChunksNames ? allChunksNames + '-' : ''}${moduleFileName}`;
                    },
                    filename: (pathData, assetInfo) => {
                        const isInitial = (pathData.chunk as Chunk).canBeInitial();
                        return `js/commons/${isInitial ? 'initial' : 'async'}/[name].[contenthash].js`;
                    }
                }
            }
        },
    }
};

export default config;
