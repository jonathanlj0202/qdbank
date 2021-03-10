module.exports = {
    publicPath: './',
    outputDir: '../myApp1/www',
    productionSourceMap: false,
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
        }
    },
    chainWebpack: config => {
        config.module
            .rule("css")
            .test(/\.css$/)
            .oneOf("vue")
            .resourceQuery(/\?vue/)
            .use("px2rem")
            .loader("px2rem-loader")
            .options({
                remUnit: 324
            });
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                'appId': 'JBRH-PHJR',
                'productName': '农业银行',
                'win': {
                    'target': 'nsis',
                    'icon': 'public/favicon.ico'
                }
            }
        }
    }
}