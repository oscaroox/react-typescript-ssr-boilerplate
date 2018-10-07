// tslint:disable:object-literal-sort-keys
import path from "path";
import webpack from "webpack";
// tslint:disable-next-line:no-var-requires
const ReactLoadablePlugin = require("react-loadable/webpack").ReactLoadablePlugin;

const clientConfig: webpack.Configuration = {
    name: "client",
    entry: [
        "webpack-hot-middleware/client",
        "./src/client.tsx",
    ],
    output: {
        publicPath: "/static/",
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
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
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "url-loader",
                options: {
                  limit: 10000,
                  name: "[name].[hash:8].[ext]",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

    plugins: [
        new ReactLoadablePlugin({
            filename: "./server/react-loadable.json",
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],

    // devServer: {
    //     contentBase: "./dist",
    //     hot: true,
    // },

};

export default clientConfig;
