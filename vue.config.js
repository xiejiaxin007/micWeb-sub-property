// /* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const packageName = require('./package.json').name;
console.log(packageName)

// webpack管理iconfont,支持热更新
const WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs')
const dir = 'src/assets/fonts/iconfontNew'

let dataUrlDev = 'http://testbackendapi.comjia.com'

// 获取当前分支名为版本号
const childProcess = require('child_process');
const RELEASE = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '');
// 判断jl npm包是否更新
let npm = 'jl_ui jl-report';
childProcess.execSync(`npm ls ${npm}`);
// 赋值全局变量
process.env.VUE_APP_RELEASE = RELEASE;
// 是否是生产环境标志
const isProduction = process.env.NODE_ENV === "production";
const productionGzipExtensions = ["js", "css"];
console.log('当前环境为：', process.env.NODE_ENV, process.env.VUE_APP_REPORT_URL);
module.exports = {
    productionSourceMap: false,
    lintOnSave: false,
    devServer: {
        port: 8888,
        open: false,
        // host: '0.0.0.0',
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        proxy: {
            '/backend-api': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/backend-api/api-user': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/backend-api/bk-api-tag-manage': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/send-data': {
                target: 'http://api6.comjia.com',
                changeOrigin: true
            },
            '/backend-api/bk-map': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/api': {
                target: dataUrlDev,
                changeOrigin: true
            },
            '/backend-api/paper-map': {
                target: dataUrlDev,
                changeOrigin: true
            }
        }
    },
    css: {
        extract: false
    },
    configureWebpack: {
        performance: {
            hints: 'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        },
        output: {
            library: `${packageName}-[name]`,
            libraryTarget: 'umd',
            jsonpFunction: `webpackJsonp_${packageName}`
        },
        resolve: {
            extensions: ['.js', '.vue', '.json']
        },
        externals: {
            'BMap': 'BMap'
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
            // 配置iconfont
            new WebpackIconfontPluginNodejs({
                fontName: 'icon',
                cssPrefix: 'icon',
                svgs: path.join(dir, 'svgs/*.svg'),
                fontsOutput: path.join(dir, 'fonts/'),
                cssOutput: path.join(dir, 'fonts/font.css')
            })
        ]
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', path.join(__dirname, './src'))

        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/fonts/iconSvg'))
            .end()

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/fonts/iconSvg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        // config
        //     .plugin('webpack-bundle-analyzer')
        //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
}

function resolve(url) {
    // 路径可能与你的项目不同
    return path.join(__dirname, url)
}