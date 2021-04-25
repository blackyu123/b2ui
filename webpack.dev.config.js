const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_DIR = path.resolve(__dirname, "build");
const APP_DIR = path.resolve(__dirname, "src");

module.exports = env => {
    const environment = env || "";
    console.log('Running In Environment:', environment);

    return {
        entry: APP_DIR + "/index.js",
        output: {
            path: BUILD_DIR,
            filename: "js/main.[fullhash:6].js",
            publicPath: "/",
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules\/(?!strophe.js).*/,
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-react",
                            "@babel/preset-env", {
                                "include": [
                                    "@babel/plugin-proposal-object-rest-spread",
                                    "@babel/plugin-proposal-class-properties"

                                ]
                            }
                        ]
                    },
                },
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: ["style-loader", {loader: "css-loader"}, {loader: "sass-loader"}],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: "file-loader?name=images/img-[contenthash:6].[ext]&publicPath=/",

                },
                {
                    test: /\.mp3$/,
                    use: "file-loader?name=images/img-[contenthash:6].[ext]&publicPath=/",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".js", ".json", ".jsx"]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "public/index.html",
                filename: "index.html",
                chunksSortMode: 'none',
                // favicon: "./assets/icons/favicon.png"
            }),
            new MiniCssExtractPlugin({
                filename: "[name].[chunkhash:6].css",
                chunkFilename: "[id].[chunkhash:6].css",
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    API_HOST: apiUrl,
                    SOCKET_HOST: socketUrl,
                    XMPP_BOSH_URL: openfireBoshUrl,
                    XMPP_DOMAIN: openfireDomain,
                    MUC_DOMAIN: openfireMucDomain,
                    ENV: JSON.stringify(env)
                },
            }),
        ],
        devServer: {
            historyApiFallback: true,
            hot: true,
        },
    };
};
