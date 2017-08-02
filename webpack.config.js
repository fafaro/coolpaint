const path = require('path');

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' }
    ]
  },
   resolve: {
  //   modules: [
  //     path.resolve(__dirname, "src"), 
  //     path.resolve(__dirname, "src/components"), 
  //     "node_modules"
  //   ],
     extensions: ['.ts', '.js']
   }
};

module.exports = config;