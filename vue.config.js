if (!process.env.OPENFAAS_BASIC_AUTH_HEADER) {
  console.error('Missing OPENFAAS_BASIC_AUTH_HEADER')
}

module.exports = {
  devServer: {
    proxy: {
      '^/functions': {
        target: "http://faas.srv.disarm.io/system",
        headers: {Authorization: process.env.OPENFAAS_BASIC_AUTH_HEADER}
      }
    }
  }
}
