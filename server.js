/**
 * Created by xzillion .
 * Date: 2017/4/25
 * Description: 开发服务器配置
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');

//代理服务器
var proxy = [{
    path: '/*/*', //必须得有一个文件地址，如果顶层文件夹名字不同，则用/*代替
    target: 'http://dev.fe.ptdev.cn',
    host: 'dev.fe.ptdev.cn',
    secure: false
}];
var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    progress: true,
    contentBase:'./src/',//静态资源路径，默认为配置文件相同路径
    stats: {
        colors: true,
    },
    proxy
});
server.app.get('/getNews', function (req, res) {
    var superagent = require('superagent');
    var sreq = superagent.get(`http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=12&page=${req.query.page}&plat=android&version=9724`);
    sreq.pipe(res);
    sreq.on('end', function(){
        //console.log(res);
    });
})
//将其他路由，全部返回index.html
server.app.get('*', function(req, res) {
    res.sendFile(__dirname + '/src/index.html')
});
server.listen(8088, function() {
    console.log('正常打开8088端口')
});
