if (!process.env.OPENFAAS_BASIC_AUTH_HASH) {
  console.error('Missing OPENFAAS_BASIC_AUTH_HASH')
}

module.exports = {
  devServer: {
    proxy: {
      '^/functions': {
        target: "http://faas.srv.disarm.io/system",
        headers: {Authorization: 'Basic ' + process.env.OPENFAAS_BASIC_AUTH_HASH}
      }
    }
  }
}
