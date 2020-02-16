module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8088/api",
                secure: false,
                changeOrigin: false,
                pathRewrite: {
                    "^/api": "/"
                }
            }
        }
    }
}
