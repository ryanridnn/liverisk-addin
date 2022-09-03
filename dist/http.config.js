const pem = require("https-pem");

module.exports = {
  cert: pem.cert,
  key: pem.key,
  passphrase: "12345",
};
