// tslint:disable:object-literal-sort-keys
import path from "path";
import webpack from "webpack";

const clientConfig: webpack.Configuration = {
    mode: "development",

    entry: [
        "webpack-hot-middleware/client",
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
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],

    devServer: {
        contentBase: "./dist",
        hot: true,
    },

};

export default clientConfig;
