const get = require("lodash").get;
const axios = require("axios");

exports.renderDashboard = async function(req, res) {
  const HTML = renderView({
    content: await get_content()
  });
  res.writeHead(200, { "Content-Type": "text/html " });
  res.end(HTML);
};

function renderView({ content }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/picnic">
      <title>DiSARM Functions Dashboard</title>
      <style>.down{color: red;} .up{color: green;}</style>
    </head>

    <body style='padding: 5px 10px; font-size: 0.8em;'>
      <h1>DiSARM Functions Status Dashboard</h1>  
      ${content}
      <div>The data above is combined live from the OpenFaas server, and the Airtable. </div>

    </body>
    </html>
  `;
}

function format_table(table) {
  return `
  <table>
    <thead>
      <tr>
        <th>Deployed to OpenFaas</th>
        <th>Function name</th>
        <th>Repository</th>
        <th>Docker image</th>
        <th>UI link</th>
        <th>UI repo</th>
        <th>Used by</th>
      </tr>
    </thead>
    <tbody>
      ${table}
    </tbody>
  </table>`
}

async function get_content() {
  const data = await fetch_and_combine();
  if (data.error) {
    return `<h2>Problem retrieving remote data - check API keys for Airtable and OpenFaas?</h2>`
  } else {
    const table_content = data
      .map(line => {
        const tds = `
      <td><span class="${line.live ? "up" : "down"}">${ line.live ? "up" : "down" }</span></td>
      <td><a href="https://faas.srv.disarm.io/function/${line.function_name}">${ line.function_name }</a></td>
      <td><a href="${line.repo}">${line.repo.replace( "https://github.com/", "" )}</a></td>
      <td><a href="https://hub.docker.com/r/${line.image.split(":")[0]}">${ line.image }</a></td>
      <td><a href="${line.ui}">${line.ui.replace(/https?\:\/\//, "")}</a></td>
      <td><a href="${line.ui_repo}">${line.ui_repo.replace( "https://github.com/", "" )}</a></td>
      <td>${line.uses ? line.uses : "no uses listed"}</td>
      `;
        return `<tr>${tds}</tr>`;
      })
      .join("");
    return format_table(table_content)
  }
}

async function fetch_and_combine() {
  try {
    const static_info = await fetch_static_info();
    const fn_status = await fetch_openfaas_functions();
    return combine(static_info, fn_status);
  } catch (e) {
    throw new Error(
      "Cannot get OpenFaas or Airtable data - check connections and/or credentials?"
    );
  }
}

async function fetch_static_info() {
  const url = "https://api.airtable.com/v0/app2A1oMnkLm1B747/list";
  const AIRTABLE_KEY = process.env.AIRTABLE_KEY;
  const headers = { Authorization: AIRTABLE_KEY };
  const res = await axios.get(url, { headers });
  const records = get(res, "data.records", []);
  if (records) {
    return records.map(record => normalise_static_fields(record.fields));
  }

  return [];
}

function normalise_static_fields(fields) {
  return {
    function_name: get(fields, "function_name", "no function - impossible?"),
    repo: get(fields, "repo", "none - weird"),
    ui: get(fields, "ui", "none"),
    ui_repo: get(fields, "ui_repo", "none"),
    uses: get(fields, "uses", "no registered uses")
  };
}

async function fetch_openfaas_functions() {
  //  Make request
  const url = "https://faas.srv.disarm.io/system/functions";
  const OPENFAAS_KEY = process.env.OPENFAAS_KEY;
  const headers = {
    Authorization: OPENFAAS_KEY
  };
  try {
    const res = await axios.get(url, { headers });
    //  Check response
    if (res.data && res.data.length > 0) {
      return res.data.map(fields => normalise_status_fields(fields));
    }
    throw new Error("Missing data from OpenFaas request");
  } catch (e) {
    throw new Error("Missing data from OpenFaas request");
  }
}

function normalise_status_fields(fields) {
  return {
    function_name: get(fields, "name", "no function"),
    image: get(fields, "image", "no image")
  };
}

function combine(static_info, fn_status) {
  return static_info.map(f => {
    const remote_image = get(
      find_image_by_name(f.function_name, fn_status),
      "image",
      "no image"
    );
    return Object.assign({ image: remote_image }, f, {
      live: remote_image !== "no image"
    });
  });
}

function find_image_by_name(name, fn_status) {
  return fn_status.find(s => s.function_name === name);
}
