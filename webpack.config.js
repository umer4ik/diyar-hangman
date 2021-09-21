const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
              // sassOptions: {
              //   outputStyle: "compressed",
              // },
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 8080,
    liveReload: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.relative(__dirname, './public/index.html'),
      title: 'Diyar oyun'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'public/assets'), to: path.resolve(__dirname, 'dist/assets') }
      ]
    })
  ]
}
