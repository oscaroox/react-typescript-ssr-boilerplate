import express from "express";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import Loadable from "react-loadable";
import { StaticRouter } from "react-router";
import { App } from "../src/components/App";
import { HtmlBuilder } from "./htmlBuilder";

let reactLoadableStats: any = {};

if (process.env.NODE_ENV === "development") {
    // tslint:disable-next-line:no-var-requires
    reactLoadableStats = require("./react-loadable.json");
}

export default function serverRenderer(stats: any): express.RequestHandler {
    return (req, res, next) => {
        
        if (process.env.NODE_ENV === "development") {
            stats = reactLoadableStats;
        }

        const modules: any[] = [];
        const context: {} = {};

        const component = renderToString(
            <Loadable.Capture report={(moduleName: any) => modules.push(moduleName)}>
                <StaticRouter context={context} location={req.url}>
                    <App />
                </StaticRouter>
            </Loadable.Capture>);

        const html = new HtmlBuilder(component, stats, modules);

        res.send(html.renderToString());
    };
}
