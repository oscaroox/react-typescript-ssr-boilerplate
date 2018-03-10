// tslint:disable:object-literal-sort-keys
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

const serverConfig: webpack.Configuration = {
    name: "server",
    mode: "production",
    context: __dirname,
    entry: [
        "./server/render.tsx",
    ],
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        path: __dirname + "/build/server",
        libraryTarget: "commonjs2",
        filename: "render.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
        splitChunks: false,
    },
    externals: [nodeExternals()],
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
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ],
};

export default serverConfig;
