var path = require('path');
var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var production = process.env.NODE_ENV === 'production';
var CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = function (env = {}) {
  const isProd = !!env.prod;
  const buildType = env.type;
  const devServer = !!env.devServer;

  console.log(isProd ? 'Production build' : 'Development build');
  console.log('Build type: ', buildType);

  const plugins = [
    new CleanWebpackPlugin(['build/' + buildType], {
      root: path.resolve(__dirname, './'),
      verbose: true,
      dry: false
    })
  ];

  if (isProd && buildType !== 'server') {
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

  let entry, target, rules = [];

  if (buildType === 'server') {
    entry = {server: ['./server/index.js']};
    target = 'node';

    rules = rules.concat([{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      }
    }]);
  } else {
    entry = {client: ['babel-polyfill', './client/index.js']};
    target = 'web';

    rules = rules.concat([{
      test: /\.js$/,
      exclude: /(pages|node_modules)/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.js$/,
      include: /pages/,
      exclude: /node_modules/,
      use: [
        {loader: 'bundle-loader', options: {lazy: true}},
        {loader: 'babel-loader'}
      ]
    }]);
  }

  rules = rules.concat([{
    test: /.(png|woff(2)?|eot|ttf|svg|gif)$/,
    use: {loader: 'url-loader?limit=100000'}
  }, {
    test: /\.scss$/,
    use: [
      {loader: "style-loader"},
      {loader: "css-loader" + (!isProd ? '?sourceMap' : '')},
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [precss, autoprefixer]
        }
      },
      {loader: "sass-loader" + (!isProd ? '?sourceMap' : '')}
    ]
  }, {
    test: /\.json$/,
    use: [{loader: 'json-loader'}]
  }]);

  let config = {
    entry,
    output: {
      path: path.join(__dirname, './build/' + buildType),
      filename: 'index.js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: devServer ? 'http://localhost:8080/static/' : '/static/',
    },
    devServer: {
      contentBase: path.resolve(__dirname, './build/' + buildType),
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
      rules
    },
    plugins,
    target
  };

  if (!isProd) {
    config.devtool = 'source-map';
  }

  return config;
};
