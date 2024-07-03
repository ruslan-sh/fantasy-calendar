const { mergeWithRules } = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = mergeWithRules({
    module: {
        rules: {
            test: "match",
            use: "prepend",
        },
    },
})(common, {
    mode: "development",
    devServer: {
        static: "./dist",
    },
    devtool: "inline-source-map",
    module: {
        rules: [{ test: /\.css$/, use: ["style-loader"] }],
    },
    optimization: {
        runtimeChunk: "single",
    },
});
