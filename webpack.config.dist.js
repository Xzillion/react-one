/**
 * Created by xzillion .
 * Date: 2017/4/25
 * Description:webpack打包配置
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var pxtorem = require('postcss-pxtorem');
var CleanWebpackPlugin = require('clean-webpack-plugin');

//定义地址
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.jsx地址
var DIST_PATH = path.resolve(ROOT_PATH, 'dist/react-one'); //发布文件所存放的目录/build/dist/前面加/报错？
var svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
    path.resolve(APP_PATH, '/Statics'), // 2. 自己私人的 svg 存放目录
];
module.exports = {
    entry: {
        app: APP_FILE,
        common: [  //打包公共组件
            "react",
            'react-dom',
            'react-router',
            'redux',
            'react-redux',
            'redux-thunk',
            'immutable',
            'moment',
            'react-swipeable-views'
        ]
    },
    output: {
        publicPath: '', //output.publicPath 表示资源的发布地址，当配置过该属性后，打包文件中所有通过相对路径引用的资源都会被配置的路径所替换。
        path: DIST_PATH, //编译到当前目录
        filename: 'js/[name].[hash:5].js', //编译后的文件名字
        chunkFilename: 'js/[name].[chunkhash:5].min.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/,
            loader: 'babel'
        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css!postcss', 'autoprefixer'])
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css!postcss', 'autoprefixer', 'less'])
        }, {
            test: /\.scss$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css!postcss', 'autoprefixer', 'sass']),
            include: [APP_PATH]
        }, {
            test: /\.(svg)$/i,
            loader: 'svg-sprite',
            include: svgDirs // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=Statics/[name].[hash:5].[ext]',
            include: [APP_PATH]
        }, {
            test: /\.(png|jpg|gif)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=Images/[name].[hash:5].[ext]',
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx', 'babel'],
            include: [APP_PATH]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production') //定义生产环境
            }
        }),
        new CleanWebpackPlugin([DIST_PATH], {  //清空dist目录
            root: ROOT_PATH,
            verbose: true,
            dry: false
        }),

        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),

        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: 'index.html', //生成的html存放路径，相对于 path
            template: './src/Template/index.html', //html模板路径
            inject: 'body',
            hash: false,
        }),
        new ExtractTextPlugin('css/[name].[hash:5].css'),
        //提取出来的样式和common.js会自动添加进发布模式的html文件中，原来的html没有
        new webpack.optimize.CommonsChunkPlugin("common", "js/common.bundle.[hash:5].js"),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false, // remove all comments
            },
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['', '.web.js', '.js', '.jsx', '.css', '.less', '.scss', '.json'], //后缀名自动补全
        root: [path.resolve('src'), __dirname]
    },
    postcss: [
        pxtorem({
            rootValue: 100,   //px转rem
            propWhiteList: [],
        })
    ]
};