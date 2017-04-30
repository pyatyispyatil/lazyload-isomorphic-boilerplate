const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const production = process.env.NODE_ENV === 'production';

module.exports = function (env = {}) {
  const IS_PROD = !!env.PROD;
  const BUILD_TYPE = env.BUILD_TYPE;
  const DEV_SERVER = !!env.DEV_SERVER;

  console.log(IS_PROD ? 'Production build' : 'Development build');
  console.log('Build type: ', BUILD_TYPE);

  const plugins = [
    new CleanWebpackPlugin(['build/' + BUILD_TYPE], {
      root: path.resolve(__dirname, './'),
      verbose: true,
      dry: false
    }),
    new webpack.DefinePlugin({
      __SERVER__: !production,
      __DEVELOPMENT__: !production,
      __DEVTOOLS__: !production,
      'process.env': {
        WHO_I_AM: JSON.stringify(BUILD_TYPE)
      }
    })
  ];

  if (IS_PROD && BUILD_TYPE !== 'server') {
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

  if (BUILD_TYPE === 'server') {
    entry = {server: ['babel-polyfill', './server/index.js']};
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
      {loader: "css-loader" + (IS_PROD ? '?sourceMap' : '')},
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [precss, autoprefixer]
        }
      },
      {loader: "sass-loader" + (IS_PROD ? '?sourceMap' : '')}
    ]
  }, {
    test: /\.json$/,
    use: [{loader: 'json-loader'}]
  }]);

  let config = {
    entry,
    output: {
      path: path.join(__dirname, './build/' + BUILD_TYPE),
      filename: 'index.js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: DEV_SERVER ? 'http://localhost:8080/static/' : '/static/',
    },
    devServer: {
      contentBase: path.resolve(__dirname, './build/' + BUILD_TYPE),
      inline: !IS_PROD
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

  if (!IS_PROD) {
    config.devtool = 'source-map';
  }

  return config;
};
