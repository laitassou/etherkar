let path = require('path');
let webpack = require('webpack');

var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = 'production';

module.exports = {
    context: __dirname,

    entry: './assets/react/index',

    output: {
        path: path.resolve('./assets/bundles'),
        filename: '[name].js',
    },


    module: {
        loaders: [
            {
                exclude: [
                  /\.html$/,
                  /\.(js|jsx)$/,
                  /\.css$/,
                  /\.json$/,
                  /\.woff$/,
                  /\.woff2$/,
                  /\.(ttf|svg|eot)$/
                ],
                loader: 'url',
                query: {
                  limit: 10000,
                  name: 'static/media/[name].[hash:8].[ext]'
                }
              },              
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015','stage-0']
                }
            },

            {
                test: /\.json$/,
                loader: 'json'
              },

              {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss')
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
              },
              {
                test: /\.svg$/,
                loader: 'file',
                query: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              },     
               // "file" loader for fonts
              {
                test: /\.woff$/,
                loader: 'file',
                query: {
                  name: 'fonts/[name].[hash].[ext]'
                }
              },
              {
                test: /\.woff2$/,
                loader: 'file',
                query: {
                  name: 'fonts/[name].[hash].[ext]'
                }
              },
              {
                test: /\.(ttf|eot)$/,
                loader: 'file',
                query: {
                  name: 'fonts/[name].[hash].[ext]'
                }
              }         
        ]
    },

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },

  // We use PostCSS for autoprefixing only.
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
    ];
  },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),

        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': '"' + process.env.NODE_ENV + '"'
          }
        }),

    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.

    // Generates an `index.html` file with the <script> injected.

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.

    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css')

  ]


};
