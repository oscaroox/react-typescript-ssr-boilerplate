import express from "express";
import path from "path";
import Loadable from "react-loadable";
import serveFavicon from "serve-favicon";
import { config } from "./config";

const app = express();

app.use(serveFavicon(path.resolve(config.staticPath, "favicon.ico")));
app.use("/static/", express.static(config.staticPath));

if (!config.isProd) {

  // tslint:disable:no-var-requires
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const webpackHotServerMiddleware = require("webpack-hot-server-middleware");
  const clientConfig = require("../webpack.client.dev").default;
  const serverConfig = require("../webpack.server").default;
  // tslint:enable:no-var-requires

  const compiler = webpack([clientConfig, serverConfig]);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: clientConfig.output.publicPath,
    serverSideRender: true,
  }));

  app.use(webpackHotMiddleware(compiler.compilers.find((c: any) => c.name === "client")));

  app.use(webpackHotServerMiddleware(compiler));
} else {
  // tslint:disable:no-var-requires
  const serverRenderer = require("./render").default;
  const reactLoadableStats = require("./react-loadable.json");
  const webpackStats = require("./stats.json");
  // tslint:enable:no-var-requires

  const stats = Object.assign({}, reactLoadableStats, webpackStats);

  app.use(serverRenderer(stats));
}

Loadable.preloadAll()
.then(() => {
  app.listen(config.serverPort, (err: any) => {
    if (err) {
        // tslint:disable-next-line:no-console
      return console.error(err);
    }
    // tslint:disable-next-line:no-console
    console.log(`running at http://localhost:${config.serverPort}`);
    // tslint:disable-next-line:no-console
    console.log(`environemt: ${config.env}`);
  });
});
