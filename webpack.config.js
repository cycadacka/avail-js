const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

function config(entry, library, filename) {
  return {
    mode: 'development',
    entry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'umd',
        name: library,
      },
      filename,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: ['/node_modules/'],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
          type: 'asset',
        },
      ],
    },
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  };
}

module.exports = config('./exports/avail-js.ts', 'AvailJS', 'avail-js.min.js');
