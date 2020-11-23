module.exports = {
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
    }
}