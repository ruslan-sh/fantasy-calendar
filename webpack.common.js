const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            { test: /\.css$/, use: ["css-loader"] },
            { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
            { test: /\.js$/, enforce: "pre", use: "source-map-loader" },
        ],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.ejs",
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};
