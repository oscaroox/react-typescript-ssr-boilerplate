import path from "path";
const env = process.env;

const isProd = env.NODE_ENV === "production";
const isDev = env.NODE_ENV === "development";

// do not use isProd, isDev ..etc in render.tsx
// tslint:disable:object-literal-sort-keys
export const config = {
    env: env.NODE_ENV,
    serverHost: env.SERVER_HOST || "localhost",
    serverPort: env.SERVER_PORT || 3000,
    isDev,
    isProd,
    staticPath: isProd && path.resolve(__dirname, "../client")
        || path.resolve(__dirname, "../src/public"),
};
