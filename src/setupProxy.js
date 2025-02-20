const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:7130',
      changeOrigin: true,
      secure: false,
      headers: {
        Connection: 'keep-alive'
      },
      pathRewrite: {
        '^/api': '/api'
      },
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: (err, req, res) => {
        console.warn('Proxy Error:', err);
        res.status(500).send('Proxy Error');
      },
      logLevel: 'debug'
    })
  );
}; 