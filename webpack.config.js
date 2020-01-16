const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build-utils/loadPresets');
const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const polyfills = [
  {
    from: path.resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
    to: 'vendor',
    flatten: true
  },
  {
    from: path.resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
    to: 'vendor/bundles',
    flatten: true
  },
  {
    from: path.resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
    to: 'vendor',
    flatten: true
  }
];

const assets = [
  {
    from: 'src/img',
    to: 'img/'
  }
];

module.exports = ({ mode, presets }) => {
  return webpackMerge(
  {
    mode,
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      port:9000,
      compress:true
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
              plugins: [
                ['@babel/plugin-syntax-dynamic-import'],
                ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                ['@babel/plugin-proposal-class-properties', { "loose": true }]
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    targets: '>1%, not dead, not ie 11'
                  }
                ]
              ]
            }
          }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        title: 'LitElement application',
        myPageHeader: 'LitElement Application with Vaadin',
        template: './src/index.html',
        filename: 'index.html',
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        }
      }),
      new CopyWebpackPlugin([...polyfills, ...assets], {
        ignore: ['.DS_Store']
      }),
    ]
    },
    modeConfig({ mode, presets }),
    loadPresets({ mode, presets })
    );
};