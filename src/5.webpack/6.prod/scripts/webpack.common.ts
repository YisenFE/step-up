
// Types
import { Configuration } from 'webpack';

// Modules
import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { images, svg, media } from './config/assets';

export default function (nodeEnv: string): Configuration {
    const isProductionMode = nodeEnv === 'production';
    const config: Configuration = {
        mode: isProductionMode ? 'production' : 'development',
        entry: {
            // index: './src/index.ts',
            // https://webpack.docschina.org/guides/entry-advanced/
            index: ['./src/index.ts', './src/style/index.scss'],
            another: './src/another-module.ts',
        },
        output: {
            path: resolve(__dirname, '../dist'),
            filename: isProductionMode ?
                `js/[name].[contenthash].js` : 'js/[name].js',
            clean: true
        },
        // 构建目标 https://webpack.docschina.org/configuration/target/#root
        target: 'browserslist',
        stats: 'normal',
        module: {
            rules: [
                { test: /.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
                {
                    test: /.css$/,
                    use: [
                        isProductionMode
                            ? {
                                loader: MiniCssExtractPlugin.loader,
                                options: {
                                    publicPath: '/'
                                }
                            } : 'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                    ]
                                }
                            }
                        },
                        'sass-loader'
                    ]
                },
                images,
                svg,
                media
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isProductionMode
                    ? 'css/[name].[contenthash].css' : 'css/[name].css'
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './public/index.html'
            })
        ],
        optimization: {
            // https://webpack.js.org/guides/code-splitting/#entry-dependencies
            runtimeChunk: 'single',
            // https://webpack.docschina.org/guides/caching/#module-identifiers
            moduleIds: 'deterministic',
            // chunkIds: 'deterministic',
        }
    };

    if (process.env.bundle_analyze_report === 'true') {
        config.plugins?.push(new BundleAnalyzerPlugin())
    }

    return config;
}
