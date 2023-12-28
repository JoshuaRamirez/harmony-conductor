const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const outputFolder = "lib"
// Common configuration settings
function createCommonConfig(isProduction) {
    return {
        mode: isProduction ? 'production' : 'development',
        entry: './index.ts',
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        devServer: {
            open: true,
            host: 'localhost',
        },
        module: {
            rules: [
                {
                    test: /\.(ts)$/i,
                    loader: 'ts-loader',
                    exclude: ['/node_modules/'],
                },
                // ... other rules
            ],
        },
        resolve: {
            extensions: ['.ts', '.js', '...'],
        },
    };
}

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    const commonConfig = createCommonConfig(isProduction);

    // UMD Configuration
    const umdConfig = {
        ...commonConfig,
        output: {
            path: path.resolve(__dirname, outputFolder),
            filename: 'harmony-conductor.umd.js',
            libraryTarget: 'umd',
            library: 'HarmonyConductor',
            umdNamedDefine: true,
        },
    };

    // CommonJS Configuration
    const commonJsConfig = {
        ...commonConfig,
        output: {
            path: path.resolve(__dirname, outputFolder),
            filename: 'harmony-conductor.common.js',
            libraryTarget: 'commonjs2',
        },
    };

    // ES Module Configuration
    const esmConfig = {
        ...commonConfig,
        output: {
            path: path.resolve(__dirname, outputFolder),
            filename: 'harmony-conductor.esm.js',
            libraryTarget: 'module',
        },
        experiments: {
            outputModule: true,
        },
    };

    return [umdConfig, commonJsConfig, esmConfig];
};
