// tslint:disable:object-literal-sort-keys
import path from "path";
import webpack from "webpack";

const clientConfig: webpack.Configuration = {
    mode: "development",

    entry: [
        "./src/client.tsx",
    ],
    output: {
        publicPath: "/static/",
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
        splitChunks: false,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: true,
                            plugins: ["react-hot-loader/babel"],
                        },
                    },
                    "ts-loader",
                ],
            },
        ],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],

    devServer: {
        hot: true,
    },

};

export default clientConfig;
