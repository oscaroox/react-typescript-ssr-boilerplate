import express from "express";

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
    stats = require("../build/client/stats.json");
}

app.use("*", (req, res, next) => {
    res.send(`
        <html>
            <head>
            </head>
            <body>
                <div id="root"></div>
                <script src="bundle.js"></script>
            </body>
        </html>
    `);
});

app.listen(3000, () => {
    // tslint:disable-next-line:no-console
    console.log("listening on port 3000");
});
