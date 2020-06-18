const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const shellJs = require("shelljs");

const PRODUCTION = (process.env.NODE_ENV === "production");
const STATS = (!!process.env.STATS);

const JS_OUTPUT_DIRECTORY = path.join(__dirname, "docs/");

if (!fs.existsSync(JS_OUTPUT_DIRECTORY))
{
    shellJs.mkdir("-p", JS_OUTPUT_DIRECTORY);
}

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        "main": "./src/index.js",
        "height": "./src/index-height.js",
        "kontra": "./src/index-kontra.js"
    },

    devtool: "source-map",

    output: {
        path: JS_OUTPUT_DIRECTORY,
        filename: "bundle-[name]-[chunkhash].js",
        chunkFilename: "bundle-[name]-[chunkhash].js",

        library: "Game",
        libraryTarget: "var"
    },


    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            chunks: ["vendors", "main"],
            template: "src/template.html",
            filename: "index.html"
        }),

        new HtmlWebpackPlugin({
            inject: "body",
            chunks: ["vendors", "height"],
            template: "src/template.html",
            filename: "height.html"
        }),

        new HtmlWebpackPlugin({
            inject: "body",
            chunks: ["vendors", "kontra"],
            template: "src/template.html",
            filename: "kontra.html"
        }),

        new MiniCssExtractPlugin({
            filename: "bundle-[name]-[chunkhash].css",
            chunkFilename: "bundle-[id]-[chunkhash].css"
        }),


        new webpack.DefinePlugin({
            "__PROD": PRODUCTION,
            "__DEV": !PRODUCTION,
            "__STATS": STATS,
            "process.env.NODE_ENV": JSON.stringify(PRODUCTION ? "production" : "development")
        }),

        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
        }),
        new CopyWebpackPlugin([
            { from: 'atlas/atlas-*' },
            { from: 'files/css', to: "css" },
            { from: 'files/webfonts', to: "webfonts" },
        ])
    ],

    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            },
            // babel transpilation ( see .babelrc for babel config)
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },

            // this is just concatenating the .css modules in components to one bundle.
            // No postprocessing of that.
            {
                test: /\.css$/,
                //                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },

            {
                test: /atlas-[0-9]+.json$/,
                use: [
                    {
                        loader: "json-loader",
                        options: {}
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {}
                    }
                ]
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    }
};
