const {logger}= require("../utils/logger")
const mtnMomo = require("dadson-momo-stk");
const _Momo = new mtnMomo({
  basicAuth: process.env.SANDBOX_BASIC_AUTH,
  collectionKey: process.env.SANDBOX_OCP_COLLECTION_KEY,
  baseUrl: "https://sandbox.momodeveloper.mtn.com", // Sandbox baseUrl
  targetEnvironment: "sandbox", // Sandbox environment
});

const CreateAccessToken = async (req, res, next) => {
  logger("dadson-momo-stk-internal-access-token-generator-middleware",'appending token to request...');
  try {
    const tokenResponse = await _Momo.createAccessToken();
    logger("tokenResponse",tokenResponse);
    if (tokenResponse) {
      if (tokenResponse.access_token) {
        req.body.access_token = tokenResponse.access_token;
        logger("middleware-access-token",req.body.access_token);
        next();
      } else {
        res.status(400).json({ error: "No token in body" });
      }
    } else {
      res.status(500).json({ error: "couldn't create access token" });
    }
  }
  catch (error) {
    logger("dadson-momo-stk-internal-access-token-generator-middleware-error",error);
    res.status(500).json({ error: "couldn't create access token" });
  }

};
module.exports = { CreateAccessToken };
