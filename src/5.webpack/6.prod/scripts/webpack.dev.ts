// Types
import { Configuration } from 'webpack';

// Modules
import { merge } from 'webpack-merge';
import common from './webpack.common';

const devConfig: Configuration = {
    devtool: 'eval',
    devServer: {
        // contentBase: './dist',
        host: '0.0.0.0',
        port: 3500,
        // hot: true,
        // compress: false,
    }
};

export default merge(common('development'), devConfig);
