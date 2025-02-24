const FormData = require('form-data');
const http = require('http');
const axios = require("axios");

const fs = require('fs');
const path = require('path');

const API_HOST = '192.168.100.202';
const API_PATH = '/v1/chat-messages';
const API_KEY = 'app-oNLncwOFIZ0rO2sxH237amkd'; // Replace with your actual API key

const API_URL = `http://${API_HOST}/v1/files/upload`; // 替換為你的 Workflow ID


async function uploadFile(filePath, apiKey, user) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();

    const fileExtension = path.extname(filePath).slice(1).toLowerCase();
    let contentType = `image/${fileExtension}`;

    if (!['png', 'jpeg', 'jpg', 'webp', 'gif'].includes(fileExtension)) {
      throw new Error("Unsupported file type. Please use png, jpeg, jpg, webp, or gif.");
    }

    // console.log(filePath)
    // console.log(contentType)

    formData.append('file', fileStream, {
      contentType: contentType,
      filename: path.basename(filePath),
    });
    formData.append('user', user);

    // console.log('不行嗎？',)

    const response = await axios.post(
      'http://192.168.100.202/v1/files/upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log('Upload successful:', response.data);
    return response.data.id;
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to be handled by the caller, if needed
  }
}


async function executeWorkflow(document_id, apiKey, user, context) {
  try {
    // const formData = new FormData();

    // formData.append('file', fileStream, {
    //   contentType: contentType,
    //   filename: path.basename(filePath),
    // });
    // formData.append('user', user);

    // console.log('不行嗎？',)

    console.log({document_id})

    const response = await axios.post(
      'http://192.168.100.202/v1/workflows/run',
      {
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
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          // ...formData.getHeaders(),
        },
      }
    );

    let output = response.data.data.outputs.text
    // let output = response.data.data
    console.log('Upload successful:', output);
    return output;
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to be handled by the caller, if needed
  }
}

async function askDify(filePath, context) {
  let document_id = await uploadFile(filePath, API_KEY, 'abc-123')
  return await executeWorkflow(document_id, API_KEY, 'abc-123', context);
}

module.exports = askDify