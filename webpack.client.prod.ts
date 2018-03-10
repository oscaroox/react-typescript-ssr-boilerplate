// tslint:disable:object-literal-sort-keys
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
        publicPath: "/",
        filename: "[name]-[hash]-bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
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
        ],
    },
    plugins: [
        new ReactLoadablePlugin({
            filename: "./build/server/react-loadable.json",
        }),
        new StatsWriterPlugin({
            filename: "../server/stats.json",
        }),
    ],
};

export default clientConfig;
