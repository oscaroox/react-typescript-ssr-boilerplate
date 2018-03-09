import express from "express";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import Loadable from "react-loadable";
import { StaticRouter } from "react-router";
import { App } from "./components/App";

// tslint:disable-next-line:no-var-requires

// tslint:disable-next-line:no-var-requires
const { getBundles } = require("react-loadable/webpack");

const app = express();
let stats: any;

if (process.env.NODE_ENV === "development") {
    // tslint:disable:no-var-requires
    const webpack = require("webpack");
    const devMiddleware = require("webpack-dev-middleware");
    const clientConfig = require("../webpack.client.dev").default;

    const compiler = webpack(clientConfig);

    app.use(devMiddleware(compiler, {
        publicPath: clientConfig.output.publicPath,
    }));

} else {
    stats = require("./react-loadable.json");
    const webpackStats = require("./stats.json");

    // need to merge webpack stats and react-loadable stats
    // so i can get the main/vendor bundles and async chunks in one object
    stats = Object.assign({}, stats, webpackStats);

    app.use("/static", express.static(path.resolve(__dirname, "..", "client")));
}

const assetBuilder = (assetStats: any, modules: any[]) => {

    const buildTag = (link: string) => `<script src="/static/${link}"></script>`;

    const chunks = assetStats && assetStats.assetsByChunkName;

    return {
        getScripts: (): string =>  {
            if (process.env.NODE_ENV === "development") {
                return buildTag("bundle.js");
            }

            // vendor shoudl be the first bundle loaded
            let bundles: string[] = [chunks["vendors~main"]];

            const asyncChunk = getBundles(assetStats, modules);

            // apply additional async chunks in bundle
            bundles = bundles.concat(asyncChunk.map((bundle: any) => bundle.file));

            // add main chunk as last.
            bundles = bundles.concat([chunks.main]);

            return bundles.map((name) => buildTag(name)).join("\n");
        },
    };
};

app.use("*", (req, res, next) => {

    const modules: any[] = [];
    const context: {} = {};

    const html = renderToString(
        <Loadable.Capture report={(moduleName: any) => modules.push(moduleName)}>
            <StaticRouter context={context}>
                <App />
            </StaticRouter>
        </Loadable.Capture>);

    const assets = assetBuilder(stats, modules);

    res.send(`
        <html>
            <head>
            </head>
            <body>
                <div id="root"></div>
                ${assets.getScripts()}
            </body>
        </html>
    `);
});

Loadable.preloadAll()
.then(() => {
    app.listen(3000, () => {
        // tslint:disable-next-line:no-console
        console.log("listening on port 3000");
    });
});
