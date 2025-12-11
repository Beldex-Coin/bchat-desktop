// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  entry: './ts/webworker/workers/util.worker.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      crypto: false,
      path: false,
      fs: false,
      stream: false,
    },
  },
  output: {
    filename: 'util.worker.js',
    path: path.resolve(__dirname, 'ts', 'webworker', 'workers'),
    globalObject: 'self',
    libraryTarget: 'umd',
  },
  target: 'webworker',
  optimization: {
    minimize: true,
  },
};
