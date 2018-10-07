// tslint:disable:object-literal-sort-keys
import CopyWebpackPlugin from "copy-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import ExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
// tslint:disable-next-line:no-var-requires
const ReactLoadablePlugin = require("react-loadable/webpack").ReactLoadablePlugin;
// tslint:disable-next-line:no-var-requires
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

const clientConfig: webpack.Configuration = {
    name: "client",
    context: __dirname,
    mode: "production",
    entry: [
        "./src/client.tsx",
    ],
    output: {
        path: __dirname + "/build/client",
        publicPath: "/static/",
        filename: "[name]-[contenthash]-bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    "babel-loader",
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                module: "esnext",
                                target: "esnext",
                            },
                        },
                    },
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "url-loader",
                options: {
                  limit: 10000,
                  name: "[name].[hash:8].[ext]",
                },
            },
            {
                test: /\.css$/,
                use: [
                    ExtractPlugin.loader,
                    "css-loader"
                ]
            },
        ],
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new ReactLoadablePlugin({
            filename: "./build/server/react-loadable.json",
        }),
        new StatsWriterPlugin({
            filename: "../server/stats.json",
        }),
        new CopyWebpackPlugin([
            { from: "./src/public"},
        ]),
        new ExtractPlugin({
            filename: "[name]-[contenthash].css",
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
        })
    ],
};

export default clientConfig;
