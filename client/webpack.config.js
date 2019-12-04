const path = require('path');
const HtmlWebpack = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotEnvWebpack = require('dotenv-webpack');

// build config can be 'production' else it is development
const developmentMode = process.env.BUILD_MODE != 'production';

const config = {
  mode: developmentMode ? 'development' : 'production',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './public'),
    filename: developmentMode ? 'dist/js/[name].js' :
      'dist/js/[name].[hash].js',
    chunkFilename: developmentMode ? 'dist/js/[name].js' :
      'dist/js/[name].[hash].js',
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, './node_modules'),
    ],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      "./src/assets/semantic/src/theme.config$": path.join(__dirname, "/semantic/src/theme.config"),
      "./src/assets/semantic/src/site": path.join(__dirname, "/semantic/src/site")
    },
  },
  plugins: [
    new HtmlWebpack({
      template: './src/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: developmentMode ? 'dist/css/[name].css' :
        'dist/css/[name].[hash].css',
      chunkFilename: developmentMode ? 'dist/css/[name].css' :
        'dist/css/[name].[hash].css',
    }),
    new DotEnvWebpack({
      path: './.env'
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: false,
              fix: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: developmentMode ? 'style-loader' :
              MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: developmentMode ? 'style-loader' :
              MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: developmentMode ? 'style-loader' :
              MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'dist/img/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff(2)?)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'dist/fonts/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    compress: true,
    publicPath: '/',
    historyApiFallback: true,
    port: 5500,
    host: '0.0.0.0',
    proxy: {
      '/token': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ignorePath: false,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ignorePath: false,
        secure: false,
      },
    },
  },
  devtool: developmentMode ? 'source-map' : 'none',
  optimization: developmentMode ?
    {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'all',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    } :
    {
      minimizer: [
        new UglifyJsPlugin({
          test: /\.js(\?.*)?$/i,
          sourceMap: true,
          uglifyOptions: {
            compress: {
              drop_console: true,
              dead_code: true,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'all',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
};

module.exports = config;
