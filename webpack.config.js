const path = require('path');

module.exports = {

  entry: ['babel-polyfill', './lib/index.js'],

  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: 'suman.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['latest'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /(\/lib\/init\/|cli.js$)/,
        loader: 'ignore-loader'
      }
    ]
  },

  resolve: {
    alias: {
      fs: require.resolve('suman-browser-polyfills/modules/fs'),
      assert: require.resolve('suman-browser-polyfills/modules/assert'),
      process: require.resolve('suman-browser-polyfills/modules/process'),
    },
    extensions: ['.js']
  },

  // packages: {
  //   'ascii-table': {
  //     main: 'index'
  //   }
  // },

  node: {
    // assert: true,
    buffer: true,
    child_process: 'empty',
    cluster: 'empty',
    console: true,
    constants: true,
    crypto: 'empty',
    dgram: 'empty',
    dns: 'mock',
    domain: true,
    events: true,
    // fs: 'empty',
    http: true,
    https: true,
    module: 'empty',
    net: 'mock',
    os: true,
    path: true,
    process: false,
    punycode: true,
    querystring: true,
    readline: 'empty',
    repl: 'empty',
    stream: true,
    string_decoder: true,
    timers: true,
    tls: 'mock',
    tty: true,
    url: true,
    util: true,
    v8: 'mock',
    vm: true,
    zlib: 'empty',
  }
};
