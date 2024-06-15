const {logger}= require("../utils/logger")
const mtnMomo = require("./mtnMomo");
const _Momo = mtnMomo(process.env.MTN_BASIC_AUTH,process.env.MTN_OCP_COLLECTION_KEY);
const { createAccessToken } = _Momo;

const CreateAccessToken = (req, res, next) => {
  logger("dadson-momo-stk-internal-access-token-generator-middleware",'appending token to request...');
  createAccessToken((error, body) => {
    if (body) {
      const _body = JSON.parse(body);
      if (_body.access_token) {
        req.body.access_token = _body.access_token;
        next();
      } else {
        res.status(400).json({ error: "No token in body" });
      }
    } else {
      res.status(500).json({ error: "couldn't create access token" });
    }
  });
};
module.exports = { CreateAccessToken };
