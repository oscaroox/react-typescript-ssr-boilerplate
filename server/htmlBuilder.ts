// tslint:disable-next-line:no-var-requires
const { getBundles } = require("react-loadable/webpack");

export interface IStats {
    assetsByChunkName: { [key: string]: string | string[] } | undefined;
}

export class HtmlBuilder {

    private stats: IStats | undefined;
    private component: string;
    private modules: any;

    constructor(component: string, stats: IStats | undefined, modules: any) {
        this.stats = stats;
        this.component = component;
        this.modules = modules;
    }

    public renderToString() {
        return `
            <html>
                <head>
                    <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
                    <title>react-typescript-ssr</title>
                    ${this.getStyles()}
                </head>
                <body>
                    <div id="root">${this.component}</div>
                    ${this.getScripts()}
                </body>
            </html>`;
    }

    private getScripts(): string {

        const asyncChunks: string[] = getBundles(this.stats, this.modules)
            .map((bundle: any) => this.buildTag(bundle.file));

        if (process.env.NODE_ENV === "development") {
            return [
                this.buildTag("manifest.js"),
                ...asyncChunks,
                this.buildTag("main.js"),
            ].join("\n");
        }

        // vendor shoudl be the first bundle loaded
        let bundles: string[] = [this.getAsset("vendor")];

        // apply additional async chunks in bundle

        bundles = bundles.concat(asyncChunks);

        // add main chunk as last.
        bundles = bundles.concat([this.getAsset("main")]);

        return bundles.join("\n");
    }

    private getStyles(): string {
        if (process.env.NODE_ENV === "development") {
            return "";
        }
        return [
            this.getAsset("vendor", ".css"),
            this.getAsset("main", ".css"),
        ].join("\n");
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
