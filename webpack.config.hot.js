/**
 * Created by xzillion .
 * Date: 2017/4/25
 * Description:webpack热替换配置
 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var OpenBrowserPlugin = require("open-browser-webpack-plugin")//打开浏览器
var pxtorem = require('postcss-pxtorem');
//定义地址
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, '/build/dist'); //发布文件所存放的目录
var svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
    path.resolve(APP_PATH, '/Style/svg') // 2. 自己私人的 svg 存放目录
];
//定义端口
var PORT = 8089;
module.exports = {
    PORT:PORT,
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: ['webpack-hot-middleware/client', APP_FILE]
    },
    output: {
        publicPath: '', //编译好的文件，在服务器的路径,这是静态资源引用路径
        path: BUILD_PATH, //发布文件地址
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/,
            loaders: [
                'react-hot', 'babel'
            ],
            include: [APP_PATH]
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loaders: [
                'style', 'css', 'postcss', 'autoprefixer', 'less'
            ],
            include: [APP_PATH]
        }, {
            test: /\.scss$/,
            exclude: /^node_modules$/,
            loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader!postcss',
            include: [APP_PATH]
        }, {
            test: /\.css$/,
            loader: "style!css!postcss"
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            loader: 'file-loader?name=[name].[ext]',
            include: [APP_PATH]
        }, {
            test: /\.(svg)$/i,
            loader: 'svg-sprite',
            include: svgDirs // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
        }, {
            test: /\.(png|jpg|gif)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=Images/[hash:8].[name].[ext]',
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: [
                'react-hot', 'jsx', 'babel'
            ],
            include: [APP_PATH]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            //process.argv：当前进程的命令行参数数组。 process.env：指向当前shell的环境变量，比如process.env.HOME。
            'process.env': {
                NODE_ENV: JSON.stringify('development') ,//定义编译环境
            },
        }),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            template: './src/Template/index.html', //html模板路径
            hash: false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new OpenBrowserPlugin({
            url: 'http://localhost:'+PORT||8089
        })

    ],
    resolve: {
        modulesDirectories: [
            'node_modules', path.join(__dirname, '../node_modules')
        ],
        extensions: [
            '',
            '.web.js',
            '.js',
            '.jsx',
            '.css',
            '.less',
            '.scss',
            '.json'
        ], //后缀名自动补全
        root: [
            path.resolve('src'),
            __dirname
        ]
    },
    postcss: [pxtorem({ rootValue: 100, propWhiteList: [] })]
};