const path = require("path");

module.exports = {
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, "src", "app")
    },
    entry: path.resolve(__dirname, "src", "ts", "main.ts"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader"
            }
        ]
    },
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "src", "app", "js"),
        publicPath: "js",
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    }
};
