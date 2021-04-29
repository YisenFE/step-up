// Types
import { Configuration, Chunk, NormalModule } from 'webpack';

// Modules
import { merge } from 'webpack-merge';
import common from './webpack.common';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
const prodConfig: Configuration = {
    optimization: {
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
        // https://webpack.docschina.org/guides/production/#minimize-css
        minimize: true,
        minimizer: [
            `...`,
            new CssMinimizerPlugin() as any
        ]
    }
};

export default merge(common('production'), prodConfig);
