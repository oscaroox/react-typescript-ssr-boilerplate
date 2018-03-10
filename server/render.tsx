import express from "express";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import Loadable from "react-loadable";
import { StaticRouter } from "react-router";
import { App } from "../src/components/App";

// tslint:disable-next-line:no-var-requires
const { getBundles } = require("react-loadable/webpack");

export default function serverRenderer(stats: any): express.RequestHandler {
    return (req, res, next) => {
        const modules: any[] = [];
        const context: {} = {};

        const html = renderToString(
            <Loadable.Capture report={(moduleName: any) => modules.push(moduleName)}>
                <StaticRouter context={context} location={req.url}>
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
    };
}

function assetBuilder(assetStats: any, modules: any[]) {

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
}
