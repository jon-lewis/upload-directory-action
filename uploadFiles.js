const axios = require('axios');
const FormData = require('form-data');
const {promisify} = require('util');
const { filesFromPath } = require('files-from-path')

async function buildForm(forms, directory) {

  const form = new FormData();
    for (const [key, value] of forms) {
        form.append(key, value);
    }
    for await (const {name, stream} of filesFromPath(directory)) {
        console.log(`adding file: ${name}`)
        form.append(name, stream());
    }
    console.log(form);

    return form
}

async function getFormHeaders (form, customHeaders) {
  const getLen = promisify(form.getLength).bind(form);
  const len = await getLen();
  return {
    ...form.getHeaders(customHeaders),
    'Content-Length': len
  }
}

async function uploadFiles(url, forms, directory, customHeaders) {
    console.log(url);
    console.log(forms);
    console.log(directory);
    const form = await buildForm(forms, directory);
    const headers = await getFormHeaders(form, customHeaders);
    console.log(headers);
    return axios.post(url, form, {headers: headers,maxContentLength: Infinity})
}


module.exports = uploadFiles;

