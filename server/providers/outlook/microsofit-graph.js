'use strict';

const request = require('axios');

const BASE_URL = 'https://graph.microsoft.com';

function getUserData(accessToken) {
  const config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  };
 
  return request.get(`${BASE_URL}/beta/me`, config);
}

function getProfilePhoto(accessToken) {
  const config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  };
 
  return request.get(`${BASE_URL}/beta/me/photo/$value`, config);
}

// TODO: Quando for usar, verificar docs.
function uploadFile(accessToken, file) {
  const config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'image/jpg'
    }
  };
 
  return request.put(`${BASE_URL}/beta/me/drive/root/children/mypic.jpg/content`, config);
}

// Ver https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/item_createlink
function getSharingLink(accessToken, id) {
  const config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  };

  const params = { type: 'view' };

  return request.post(`${BASE_URL}/beta/me/drive/items/${id}/createLink`, params, config);
}

function postSendMail(accessToken, message) {
  const config = {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Content-Length': message.length
    }
  };
 
  return request.get(`${BASE_URL}/beta/me/sendMail`, config);
}

module.exports = {
  getUserData,
  getProfilePhoto,
  uploadFile,
  getSharingLink,
  postSendMail
}