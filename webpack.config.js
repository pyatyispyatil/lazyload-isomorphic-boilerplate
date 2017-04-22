var path = require('path');
var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var production = process.env.NODE_ENV === 'production';
var CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = function (env) {
  const isProd = env && env.prod;

  console.log(isProd ? 'Production build' : 'Development build');

  const plugins = [
    new CleanWebpackPlugin(['build'], {
      root: path.resolve(__dirname, './'),
      verbose: true,
      dry: false
    }),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200 // ~50kb
    })
  ];

  if (isProd) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        compress: {
          warnings: false, // Suppress uglification warnings
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      }));
  }

  let entryPoints = ['babel-polyfill', path.resolve(__dirname, './src/js/app.js')];

  if (!isProd) {
    entryPoints.unshift("webpack-dev-server/client?http://localhost:8080/");
  }

  let config = {
    entry: {
      client: ['babel-polyfill', './client/index.js'],
      server: ['./server/index.js']
    },
    output: {
      path: path.join(__dirname, './build'),
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/build',
    },
    devServer: {
      contentBase: path.resolve(__dirname, "build"),
      inline: !isProd
    },
    stats: {
      colors: true,
      reasons: true,
      hash: false,
      modulesSort: 'name'
    },
    cache: true,
    module: {
      rules: [{
        test: /\.js$/,
        include: /(server*)|(components*)/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /src[\\|\/]app[\\|\/]root.*?\.js/,
        exclude: /(node_modules|core-js)/,
        use: [
          {loader: 'bundle-loader', options: {lazy: true}},
          {loader: 'babel-loader'}
        ]
      }, {
        test: /.(png|woff(2)?|eot|ttf|svg|gif)$/,
        use: {loader: 'url-loader?limit=100000'}
      }, {
        test: /\.scss$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader" + (isProd ? '?sourceMap' : '')},
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [precss, autoprefixer]
            }
          },
          {loader: "sass-loader" + (isProd ? '?sourceMap' : '')}
        ]
      }, {
        test: /\.json$/,
        use: [{loader: 'json-loader'}]
      }]
    },
    plugins: plugins,
    target: 'node'
  };

  if (!isProd) {
    config.devtool = 'source-map';
  }

  return config;
};