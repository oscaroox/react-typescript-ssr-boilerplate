// tslint:disable:object-literal-sort-keys
import CopyWebpackPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import webpack from "webpack";
// tslint:disable-next-line:no-var-requires
const ReactLoadablePlugin = require("react-loadable/webpack").ReactLoadablePlugin;
// tslint:disable-next-line:no-var-requires
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

const clientConfig: webpack.Configuration = {
    name: "client",
    context: __dirname,
    entry: [
        "./src/client.tsx",
    ],
    output: {
        path: __dirname + "/build/client",
        publicPath: "/static/",
        filename: "[name]-[hash]-bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                }),
            },
        ],
    },
    plugins: [
        new ReactLoadablePlugin({
            filename: "./build/server/react-loadable.json",
        }),
        new StatsWriterPlugin({
            filename: "../server/stats.json",
        }),
        new CopyWebpackPlugin([
            { from: "./src/public"},
        ]),
        new ExtractTextPlugin({
            filename: "[name]-[contenthash].css",
            allChunks: true,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.[chunkhash].js",
            minChunks: (module) => module.context && module.context.indexOf("node_modules") !== -1,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
        }),
    ],
};

export default clientConfig;
