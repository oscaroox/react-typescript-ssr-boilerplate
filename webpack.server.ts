// tslint:disable:object-literal-sort-keys
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import WriteToFilePlugin from "write-file-webpack-plugin";

const serverConfig: webpack.Configuration = {
    context: __dirname,
    entry: [
        "./src/server.tsx",
    ],
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        path: __dirname + "/build/server",
        filename: "server.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    externals: [nodeExternals()],
    optimization: {
        splitChunks: false,
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

    plugins: [
        new WriteToFilePlugin(),
    ],
};

export default serverConfig;
