module.exports = {
  devServer: {
    proxy: {
      '^/functions': {
        target: "http://faas.srv.disarm.io/system"
      }
    }
  }
}
