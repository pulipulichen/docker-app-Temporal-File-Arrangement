const FormData = require('form-data');
const http = require('http');
const axios = require("axios");

const fs = require('fs');
const path = require('path');

const API_HOST = '192.168.100.202';
const API_PATH = '/v1/workflows/run';
const YEK = 'app-cV9JZznSz3PT7HzowZdHpckv'
const USER_ID = 'abc-457'

const API_FILE_UPLOAD_URL = `http://${API_HOST}/v1/files/upload`; // 替換為你的 Workflow ID
const API_LLM_URL = `http://${API_HOST}${API_PATH}`; // 替換為你的 Workflow ID
const mime = require('mime-types')

const isReadableFileType = require('./isReadableFileType')
const sleep = require('./../lib/sleep')

async function uploadFile(filePath, yek, user) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();

    // const ext = path.extname(filePath).toLocaleLowerCase()
    console.log(isReadableFileType(filePath))
    if (isReadableFileType(filePath)) {
      // const fileExtension = path.extname(filePath).slice(1).toLowerCase();
      const ext = path.extname(filePath).toLocaleLowerCase()
      let contentType = mime.lookup(ext)
      console.log({contentType})
      if (["application/msword"].includes(contentType)) {
        contentType = "application/octet-stream"
      }

      if (contentType !== false) {
        formData.append('file', fileStream, {
          contentType: contentType,
          filename: path.basename(filePath),
        });
      }
    }
      
    formData.append('user', user);

    // console.log('不行嗎？',)

    const response = await axios.post(
      API_FILE_UPLOAD_URL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${yek}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log('Upload successful:', response.data);
    return response.data.id;
  } 
  catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to be handled by the caller, if needed
  }
}


async function executeWorkflow(document_id, yek, user, context) {
  try {
    // const formData = new FormData();

    // formData.append('file', fileStream, {
    //   contentType: contentType,
    //   filename: path.basename(filePath),
    // });
    // formData.append('user', user);

    // console.log('不行嗎？',)

    // console.log({document_id})
    let data = {
      inputs: {
        context,
        'image': [{
          type: "image",
          "transfer_method": "local_file",
          "upload_file_id": document_id
        }]
      },
      "response_mode": "blocking",
      user: user
    }

    // console.log(data)
    let headers = {
      Authorization: `Bearer ${yek}`,
      "Content-Type": "application/json"
    }
    // console.log(headers)

    const response = await axios.post(
      API_LLM_URL,
      data,
      {
        headers
      }
    );

    let output = response.data.data.outputs.text
    // let output = response.data.data
    console.log('Upload successful:', output);
    return output;
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
    // throw error; // Re-throw the error to be handled by the caller, if needed
    await sleep(30000)
    return await executeWorkflow(document_id, yek, user, context)
  }
}

const NAMED_PATTERN = /^(\d{4})(\d{2})(\d{2})\s/

async function askDify(filePath, context) {
  // console.log('Test ok: ', filePath);
  let pathParts = filePath.split('/');
  for (let i = pathParts.length - 2; i >= 0; i--) {
    const match = pathParts[i].match(NAMED_PATTERN);
    if (match) {
      return pathParts[i].slice(9).trim()
    }
  }

  // return ''

  let document_id = await uploadFile(filePath, YEK, USER_ID)
  return await executeWorkflow(document_id, YEK, USER_ID, context);
}

module.exports = askDify