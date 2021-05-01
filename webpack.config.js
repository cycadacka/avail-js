const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

function arg(library) {
  const regex = /[A-Z][^A-Z]+/g;
  let filename = "";
  let array;

  while ((array = regex.exec(library)) !== null) {
    if (filename.length > 0) {
      filename += "-";
    }

    filename += array[0].toLowerCase();
  }

  return [`./exports/${filename}.ts`, library, `${filename}.js`];
}

function config(entry, library, filename) {
  return {
    mode: "development",
    entry,
    output: {
      path: path.resolve(__dirname, "dist"),
      library: {
        type: "umd",
        name: library,
      },
      filename,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
          type: "asset",
        },
      ],
    },
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      extensions: [".tsx", ".ts", ".js"],
    },
  };
}

module.exports = [
  config(...arg("AvailCore")),
  config(...arg("AvailPhysics")),
  config(...arg("AvailShapes")),
  config(...arg("AvailSprite")),
];
