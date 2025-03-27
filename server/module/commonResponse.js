// sendJSON(res, 200, { result: "ok" });
// sendJSON(res, 200, {
//     name: "NOT USER",
//     token,
//     exp: null,
//     role: "History,Dashboard",
// });
const sendJSON = (res, statusCode, data) => {
  res.status(statusCode).json({
    result: true,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendJSONMessage = (res, status, pMsg) => {
    sendJSON(res, status, { msg: pMsg });
};

const sendJSONError = (res, statusCode, message) => {
  res.status(statusCode).json({
    result: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendJSON,
  sendJSONMessage,
  sendJSONError
};
