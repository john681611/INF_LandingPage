
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
    entry: ['./page/css/index.scss', './page/js/main.js'],
    output: {
        path: __dirname + '/assets',
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: '[id].js'
    },
    devtool: 'source-map',
    stats: {
        children: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: '.postcssrc'
                            },
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            includePaths: ['./pages/css']
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common',
            minChunks: 2
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: true
                },
                sourceMap: true
            })
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({filename: 'css/[name].css'}),
        new ManifestPlugin({
            fileName: 'build-manifest.json',
            publicPath: '/'
        })
    ]
};