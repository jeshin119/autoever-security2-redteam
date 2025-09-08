const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js', // 캐시 무효화를 위해 contenthash 사용
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:3001/api'),
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'),
      'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3001/api')
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 5173,
    host: '0.0.0.0',
    historyApiFallback: true,
    hot: true, // HMR 활성화
    headers: {
      'Cache-Control': 'no-store', // 브라우저 캐시 무시
    },
    devMiddleware: {
      writeToDisk: false, // 메모리 기반 번들 사용
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://backend:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // React.lazy 동적 import를 별도 청크로 분리
    },
    runtimeChunk: 'single' // 런타임 청크를 하나로 관리
  }
};
