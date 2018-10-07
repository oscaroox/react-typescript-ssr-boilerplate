// tslint:disable-next-line:no-var-requires
const { getBundles } = require("react-loadable/webpack");

export interface IStats {
    assetsByChunkName: { [key: string]: string | string[] } | undefined;
}

export class HtmlBuilder {

    private stats: IStats | undefined;
    private chunkPlaceholder = "<//-CHUNKS-//>";
    private componentPlaceHolder = "<//-ROOT-//>";
    private htmlString = "";

    constructor(stats: IStats | undefined) {
        this.stats = stats;
        this.htmlString = this.cacheHtmlString();
    }

    public renderToString(component: string, modules: any) {
        const asyncChunks: string = getBundles(this.stats, modules)
            .map((bundle: any) => this.buildTag(bundle.file)).join("\n");

        return this.htmlString
            .replace(this.chunkPlaceholder, asyncChunks)
            .replace(this.componentPlaceHolder, component);
    }

    private cacheHtmlString() {
        return `
            <!doctype html>
            <html>
                <head>
                    <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
                    <title>react-typescript-ssr</title>
                    ${process.env.NODE_ENV === "production" && this.getAsset("vendors", ".css") || ""}
                    ${process.env.NODE_ENV === "production" && this.getAsset("main", ".css") || ""}
                </head>
                <body>
                    <div id="root">${this.componentPlaceHolder}</div>
                    ${
                        process.env.NODE_ENV === "production"
                        ? this.getAsset("runtime")
                        : ""
                    }
                    ${
                        process.env.NODE_ENV === "production"
                        ? this.getAsset("vendors")
                        : ""
                    }
                    ${this.chunkPlaceholder}
                    ${
                        process.env.NODE_ENV === "production"
                        ? this.getAsset("main")
                        : this.buildTag("main.js")
                    }
                </body>
            </html>`;
    }

    private buildTag = (url: string) => `<script src="/static/${url}"></script>`;

    private buildStyle = (url: string) => `
        <link rel="stylesheet" type="text/css" href="/static/${url}">`

    private getAsset(chunkName: string, extension = ".js") {
        let chunks = this.stats && this.stats.assetsByChunkName
            && this.stats.assetsByChunkName[chunkName];
        if (!chunks) {
            throw new Error(`Chunk name ${chunkName} does not exists in stats file`);
        }

        if (!Array.isArray(chunks)) {
            chunks = [chunks];
        }

        const asset = chunks.find((chunk: string) => chunk.endsWith(extension));

        if (asset && extension === ".js") {
            return this.buildTag(asset);
        } else if (asset && extension === ".css") {
            return this.buildStyle(asset);
        }

        return "";
    }

}
