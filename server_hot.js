/**
 * Created by xzillion .
 * Date: 2017/4/25
 * Description:热替换服务器配置
 */
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config.hot');//引入 webpack 的配置文件和 生成 webpack 的编译器
var compiler = webpack(config);
var path = require('path');
var proxyMiddleware = require('http-proxy-middleware')
var app = express();

app.use(require('webpack-dev-middleware')(compiler, {//将编译器挂载给 webpack dev middleware
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    inline: true,
    progress: true,
    stats: {
        colors: true,
    }
}));

app.use(require('webpack-hot-middleware')(compiler));//将编译器挂载给 webpack hot middleware

//代理服务器
app.use(/\/(Free|Area|UserArea|UserHotInfo|ChampionRank|GetChampionDetail|UserExtInfo|BattleSummaryInfo|CombatList|GameDetail|champion)/, proxyMiddleware({
    target: 'http://lolapi.games-cube.com',
    changeOrigin: true
}));

app.use(/\/(GetAuthors|GetAuthorVideos|GetNewstVideos|GetHeroVideos|FindVideos)/, proxyMiddleware({
    target: 'http://infoapi.games-cube.com',
    changeOrigin: true
}));

app.use(express.static(path.join(__dirname, 'build/dist')));

//转发接口
app.get('/getNews', function (req, res) {
    var superagent = require('superagent');
    var sreq = superagent.get(`http://qt.qq.com/php_cgi/news/php/varcache_getnews.php?id=12&page=${req.query.page}&plat=android&version=9724`);
    sreq.pipe(res);
    sreq.on('end', function(){
        //console.log(res);
    });
});

//将其他路由，全部返回index.html
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/src/index.html')
});
app.listen(config.PORT||8089, 'localhost', function(error, result) {
    if (error){
        console.log(error)
    }
    else
        console.log('listen on %j', config.PORT||8089)
});