import static_info_yaml from 'yaml-loader!./static_info.yaml'
// const static_info_yaml = require('@yaml./static_info.yaml')

// Return an array suitable for sticking in a table
async function fetch_and_combine() {
  const fn_status = fetch_openfaas_functions()
  const static_info = static_info_yaml
  return static_info
  return combine(fn_status, static_info)
}

async function fetch_openfaas_functions() {
  //  Make request
  const url = "http://faas.srv.disarm.io/functions"
  const res = axios.get(url, )

  //  Check response
  //  If response valid, return something
  //  Else throw an error
}



function combine(fn_status, static_info) {
  return [fn_status, static_info]
}


export {
  fetch_and_combine
}
