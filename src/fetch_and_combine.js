import axios from 'axios'
import static_info_yaml from '!json-loader!yaml-loader!./static_info.yaml'
// const static_info_yaml = require('@yaml./static_info.yaml')

// Return an array suitable for sticking in a table
async function fetch_and_combine() {
  const fn_status = await fetch_openfaas_functions()
  const static_info = static_info_yaml
  return combine(fn_status, static_info)
}

async function fetch_openfaas_functions() {
  //  Make request
  const url = "/functions"
  try {
    const res = await axios.get(url, {auth: {username, password}})
    //  Check response
    if (res.data && res.data.length > 0) {
      return res.data
    }

  } catch(e) {
    console.error(e)
  }

}



function combine(fn_status, static_info) {
  let fn_ = fn_status.map(f => f.name)
  all_fns = all_fns.concat(Object.keys(static_info))

  return [fn_status, static_info]
}


export {
  fetch_and_combine
}
