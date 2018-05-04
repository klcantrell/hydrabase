const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    app: path.join(__dirname, "src/js/index.js")
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath:
      "https://s3.us-east-2.amazonaws.com/kals-portfolio-assets/hydrabase/",
    filename: "[name].bundle.js"
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["minify"],
              [
                "env",
                {
                  modules: false
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].css"
            }
          },
          "extract-loader",
          {
            loader: "css-loader",
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "responsive-loader",
          options: {
            name: path.join("images/", "[name]-[width].[ext]")
          }
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2|otf)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "fonts/",
            publicPath:
              "https://s3.us-east-2.amazonaws.com/kals-portfolio-assets/fonts/"
          }
        }
      }
    ]
  },
  optimization: {
    // minimizer: [new MinifyPlugin({}, {})],
  },
  plugins: [
    new MinifyPlugin(
      {
        mangle: {
          topLevel: true
        }
      },
      {
        exclude: /node_modules/
      }
    ),
    new HtmlWebpackPlugin({
      template: path.join("src/", "index.html"),
      inject: false,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        removeComments: true
      }
    })
  ]
};
