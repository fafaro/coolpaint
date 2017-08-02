const path = require('path');

const config = {
  entry: './src/index.tsx',
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
     extensions: ['.tsx', '.ts', '.js']
   },
   devtool: "source-map"
};

module.exports = config;