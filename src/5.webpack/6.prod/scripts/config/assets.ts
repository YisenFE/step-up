// 配置参考 https://webpack.docschina.org/guides/asset-modules/
// [rule.generator] https://webpack.docschina.org/configuration/module/#rulegenerator

// Types
import { RuleSetRule } from 'webpack';

interface GenAssetReturn {
    publicPath: string;
    filename: string;
}

const inlineLimit = 4 * 1024; // 4KB

function genAsset(dir: string): GenAssetReturn {
    return {
        publicPath: '../',
        filename: `${dir}/[name].[contenthash][ext]`
    };
}

function genAssetRule(dir: string, test: RegExp): RuleSetRule {
    return {
        test,
        type: 'asset',
        parser: {
            dataUrlCondition: { maxSize: inlineLimit }
        },
        generator: genAsset(dir)
    };
}

function genResourceRule(dir: string, test: RegExp): RuleSetRule {
    return {
        test,
        type: 'asset/resource',
        generator: genAsset(dir)
    };
}

function genInlineRule(dir: string, test: RegExp): RuleSetRule {
    return { test, type: 'asset/inline' };
}

export const images = genAssetRule('img', /\.(png|jpe?g|gif|webp)(\?.*)?$/);
export const svg = genResourceRule('img', /\.(svg)(\?.*)?$/);
export const media = genAssetRule('fonts', /\.(woff2?|eot|ttf|otf)(\?.*)?$/i);

