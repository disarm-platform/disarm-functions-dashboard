import axios from 'axios'
import {get} from 'lodash'

import static_info_yaml from '!json-loader!yaml-loader!./static_info.yaml'
// const static_info_yaml = require('@yaml./static_info.yaml')

// Return an array suitable for sticking in a table
async function fetch_and_combine() {
  const static_info = static_info_yaml
  const fn_status = await fetch_openfaas_functions()
  // debugger
  return combine(static_info, fn_status)
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

function combine(static_info, fn_status) {
  return static_info.map(f => {
    const remote_status = find_status_by_name(f.name, fn_status)
    const image = get(remote_status, 'image', 'no image') || 'no image'
    return {
      ...f,
      image,
    }
  })
}

function find_status_by_name(name, fn_status) {
  return fn_status.find(s => s.name === name)
}


export {
  fetch_and_combine
}
