import express from "express";
import path from "path";
import Loadable from "react-loadable";

const app = express();

if (process.env.NODE_ENV === "development") {

  // tslint:disable:no-var-requires
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const webpackHotServerMiddleware = require("webpack-hot-server-middleware");
  const clientConfig = require("../webpack.client.dev").default;
  const serverConfig = require("../webpack.server").default;
  // tslint:enable:no-var-requires
  serverConfig.mode = "development";
  const compiler = webpack([clientConfig, serverConfig]);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: "/static/",
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

  app.use("/static/", express.static(path.resolve(__dirname, "../client")));

  app.use(serverRenderer(stats));
}

Loadable.preloadAll()
.then(() => {
  app.listen(3000, (err: any) => {
    if (err) {
        // tslint:disable-next-line:no-console
      return console.error(err);
    }
    // tslint:disable-next-line:no-console
    console.log("running at http://localhost:3000");
    // tslint:disable-next-line:no-console
    console.log(`environemt: ${process.env.NODE_ENV}`);
  });
});
