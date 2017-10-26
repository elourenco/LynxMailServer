const request = require('superagent');

function getUserData(accessToken, callback) {
  request
   .get('https://graph.microsoft.com/beta/me')
   .set('Authorization', 'Bearer ' + accessToken)
   .end((err, res) => {
     callback(err, res);
   });
}

function getProfilePhoto(accessToken, callback) {
  request
   .get('https://graph.microsoft.com/beta/me/photo/$value')
   .set('Authorization', 'Bearer ' + accessToken)
   .end((err, res) => {
     callback(err, res.body);
   });
}

function uploadFile(accessToken, file, callback) {
  request
   .put('https://graph.microsoft.com/beta/me/drive/root/children/mypic.jpg/content')
   .send(file)
   .set('Authorization', 'Bearer ' + accessToken)
   .set('Content-Type', 'image/jpg')
   .end((err, res) => {
     callback(err, res.body);
   });
}

// Ver https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/item_createlink
function getSharingLink(accessToken, id, callback) {
  request
   .post('https://graph.microsoft.com/beta/me/drive/items/' + id + '/createLink')
   .send({ type: 'view' })
   .set('Authorization', 'Bearer ' + accessToken)
   .set('Content-Type', 'application/json')
   .end((err, res) => {
     callback(err, res.body.link);
   });
}

function postSendMail(accessToken, message, callback) {
  request
   .post('https://graph.microsoft.com/beta/me/sendMail')
   .send(message)
   .set('Authorization', 'Bearer ' + accessToken)
   .set('Content-Type', 'application/json')
   .set('Content-Length', message.length)
   .end((err, res) => {
     // Returns 202 if successful.
     // Note: If you receive a 500 - Internal Server Error
     // while using a Microsoft account (outlook.com, hotmail.com or live.com),
     // it's possible that your account has not been migrated to support this flow.
     // Check the inner error object for code 'ErrorInternalServerTransientError'.
     // You can try using a newly created Microsoft account or contact support.
     callback(err, res);
   });
}

exports.getUserData = getUserData;
exports.getProfilePhoto = getProfilePhoto;
exports.uploadFile = uploadFile;
exports.getSharingLink = getSharingLink;
exports.postSendMail = postSendMail;