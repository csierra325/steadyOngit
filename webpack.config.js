var path = require('path');
var webpack = require('webpack');
var workbox = require('workbox-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CircularDependencyPlugin = require('circular-dependency-plugin');
var UglifyJsPlugin  = require('uglifyjs-webpack-plugin');
var AotPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
var NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin;

var bundles = ['common', 'polyfills', 'vendor', 'app', 'styles'];

var config = {
    mode: 'none',
    entry: {
        'app': path.join(__dirname,'./src/client/main.ts'),
        'vendor': path.join(__dirname,'./src/client/vendor.ts'),
        'polyfills': path.join(__dirname,'./src/client/polyfills.ts'),
        'styles': path.join(__dirname, './src/client/scss/styles.scss')
    },
    output: {
        filename: '[name].[hash].min.js',
        path: path.join(__dirname, 'dist/client'),
        pathinfo: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.scss', '.css']
    },
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.scss$/,
                include: [path.join(__dirname, './src/client/components')],
                use: [
                    {
                        loader: 'raw-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: function(loader){
                                return [
                                    autoprefixer({remove: false, flexbox: true}),
                                    cssnano({zindex: false})
                                ];
                            }
                        }
                    },
                    {
                        loader:'sass-loader',
                        options: {
                          includePaths: [path.join(__dirname, './src/client/scss')]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                include: [
                    path.join(__dirname, './node_modules'), 
                    path.join(__dirname, './src/client/scss')
                ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: function(loader){
                                return [
                                    autoprefixer({remove: false, flexbox: true}),
                                    cssnano({zindex: false})
                                ];
                            }
                        }
                    },
                    {
                        loader:'sass-loader',
                        options: {
                            includePaths: [path.join(__dirname, './src/client/scss')]
                        }
                    }
                ]
            },
            // fonts
            {
                test: /\.((ttf)|(woff2?)|(eot))/i,
                loader: 'url-loader',
                exclude: [path.join(__dirname, './src/client/assets')],
                options: {
                    limit: 10240, // 10K limit
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /font(s)?\.svg/,
                exclude:  /\.svg\.js/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10*1024,
                            name: 'fonts/[name].svg'
                        }
                    },
                    {
                        loader: 'svgo-loader'
                    }
                ]
            },
             // images
             {
                test: /\.((jpg)|(png)|(gif)|(bmp)|(ico))/,
                loader: 'url-loader',
                exclude: [path.join(__dirname, './src/client/assets')],
                options: {
                    limit: 10240, // 10K limit
                    name: 'assets/images/[name].[ext]'
                }
            },
            {
                test: /\.svg/,
                exclude: [/font(s)?/i, /\.svg\.js/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10*1024,
                            name: 'assets/images/[name].svg'
                        }
                    },
                    {
                        loader: 'svgo-loader'
                    }
                ]
            },
            // templateUrl
            { 
                test: /\.html$/,
                use: [
                    {
                        loader: 'raw-loader'
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                  name: 'common',
                  chunks: 'initial',
                  minChunks: 2
                }
            }
        },
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: process.env.BUILD_MODE === 'development',
                cache: true,
                uglifyOptions: {
                    compress: true,
                    output: {
                        comments: false
                    }
                }
            })
        ],
        concatenateModules: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, './dist/client/index.html'),
            template: path.join(__dirname, './src/client/index.html'),
            inject: 'body',
            hash: false,
            showErrors: false,
            excludeAssets: [/styles\..*js/i],
            chunksSortMode: function(a,b) {
                return bundles.indexOf(a.names[0]) - bundles.indexOf(b.names[0]);
            },
        }),
        new HtmlWebpackExcludeAssetsPlugin(),
        new AotPlugin({
            tsConfigPath: path.join(__dirname, './src/client/tsconfig.app.json'),
            mainPath: path.join(__dirname, './src/client/main.ts'),
            typeChecking: false,
        }),
        new MiniCssExtractPlugin ({
            filename: 'styles.[contenthash].min.css'
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, './src/client/assets'),
                to: path.join(__dirname, './dist/client/assets')
            },
            {
                from: path.join(__dirname, './node_modules/snapsvg/dist/snap.svg-min.js'),
                to: path.join(__dirname, './dist/client/preload/snap.min.js')
            }
        ]),
        new NormalModuleReplacementPlugin(/environments\/environment/, function(resource) {
            resource.request = resource.request.replace(/environment$/, (process.env.BUILD_MODE === 'development' ? 'devEnvironment':'prodEnvironment'));
        }),
        new workbox.GenerateSW({
            swDest: 'sw.js',
            importsDirectory: 'wb-assets',
            exclude: [/[0-9]+\..*?\.min\.js/i, /\.map/, /wb-assets/i, /sw\.js/, /node_modules/, /\.well-known/, /manifest/],
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: /api/i,
                    handler: 'networkFirst',
                    options: {
                        networkTimeoutSeconds: 5,
                        cacheName: 'api-cache',
                        cacheableResponse: {
                            statuses: [200]
                        }
                    }
                }
            ]
        })
    ]
};

module.exports = config;
