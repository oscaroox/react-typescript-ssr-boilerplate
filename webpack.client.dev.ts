// tslint:disable:object-literal-sort-keys
import path from "path";
import webpack from "webpack";

const clientConfig: webpack.Configuration = {
    name: "client",
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
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
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
