// tslint:disable:object-literal-sort-keys
import webpack from "webpack";
// tslint:disable-next-line:no-var-requires
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

const clientConfig: webpack.Configuration = {
    context: __dirname,
    entry: [
        "./src/client.tsx",
    ],
    output: {
        path: __dirname + "/build/client",
        publicPath: "/",
        filename: "[name]-[hash]-bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
        splitChunks: {
            chunks: "initial",
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    "babel-loader",
                    "ts-loader",
                ],
            },
        ],
    },
    plugins: [new StatsWriterPlugin({
        filename: "stats.json",
    })],
};

export default clientConfig;
